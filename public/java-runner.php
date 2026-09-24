<?php
declare(strict_types=1);

interface JavaRunner
{
    /** @return array{success:bool,compiled:bool,stdout:string,stderr:string,exitCode:?int,executionTime:int,status:string} */
    public function run(string $code): array;
}

final class JavaRunnerException extends RuntimeException {}

final class DockerJavaRunner implements JavaRunner
{
    private const MAX_CODE_BYTES = 20000;
    private const MAX_OUTPUT_BYTES = 12000;
    private const TIMEOUT_SECONDS = 4;

    public function __construct(
        private readonly string $image,
        private readonly string $workRoot,
        private readonly bool $enabled
    ) {}

    public function run(string $code): array
    {
        $started = microtime(true);
        if (!$this->enabled) return $this->result(false, false, '', 'Java-Ausführung ist auf diesem Server nicht aktiviert.', null, $started, 'runner-unavailable');
        if (strlen($code) > self::MAX_CODE_BYTES) return $this->result(false, false, '', 'Der Code ist zu groß.', null, $started, 'input-too-large');
        if (str_contains($code, "\0")) return $this->result(false, false, '', 'Ungültige Eingabe.', null, $started, 'invalid-input');
        foreach (['Runtime.getRuntime', 'ProcessBuilder', 'java.net.', 'System.setSecurityManager', 'package '] as $blocked) {
            if (stripos($code, $blocked) !== false) return $this->result(false, false, '', 'Diese Java-Funktion ist in der Lernumgebung nicht erlaubt.', null, $started, 'blocked-api');
        }

        $job = $this->workRoot . '/java-' . bin2hex(random_bytes(12));
        if (!mkdir($job, 0700, true)) throw new JavaRunnerException('Temporäres Arbeitsverzeichnis konnte nicht angelegt werden.');
        try {
            file_put_contents($job . '/Main.java', $code, LOCK_EX);
            [$compileOut, $compileErr, $compileExit] = $this->dockerProcess($job, ['javac', '-encoding', 'UTF-8', 'Main.java']);
            if ($compileExit !== 0) return $this->result(false, false, $compileOut, $compileErr, $compileExit, $started, 'compile-error');
            [$stdout, $stderr, $exitCode] = $this->dockerProcess($job, ['java', '-Djava.io.tmpdir=/tmp', 'Main']);
            return $this->result($exitCode === 0, true, $stdout, $stderr, $exitCode, $started, $exitCode === 0 ? 'success' : 'runtime-error');
        } finally {
            $this->removeDirectory($job);
        }
    }

    /** @return array{string,string,int} */
    private function dockerProcess(string $job, array $program): array
    {
        $command = array_merge([
            'docker', 'run', '--rm', '--network', 'none', '--memory', '128m', '--memory-swap', '128m',
            '--pids-limit', '32', '--cpus', '0.5', '--read-only', '--cap-drop', 'ALL',
            '--security-opt', 'no-new-privileges', '--user', '1000:1000', '--tmpfs', '/tmp:rw,noexec,nosuid,size=16m',
            '--mount', 'type=bind,src=' . $job . ',dst=/workspace,rw', '--workdir', '/workspace', $this->image
        ], $program);
        $pipes = [];
        $process = proc_open($command, [1 => ['pipe', 'w'], 2 => ['pipe', 'w']], $pipes, null, null, ['bypass_shell' => true]);
        if (!is_resource($process)) throw new JavaRunnerException('Java-Sandbox konnte nicht gestartet werden.');
        stream_set_blocking($pipes[1], false);
        stream_set_blocking($pipes[2], false);
        $stdout = $stderr = '';
        $timedOut = false;
        $deadline = microtime(true) + self::TIMEOUT_SECONDS;
        do {
            $stdout .= stream_get_contents($pipes[1]);
            $stderr .= stream_get_contents($pipes[2]);
            if (strlen($stdout) + strlen($stderr) > self::MAX_OUTPUT_BYTES) {
                proc_terminate($process, 9);
                $stderr .= "\nAusgabe-Limit erreicht.";
                break;
            }
            $status = proc_get_status($process);
            if (!$status['running']) break;
            if (microtime(true) >= $deadline) {
                $timedOut = true;
                proc_terminate($process, 9);
                break;
            }
            usleep(20000);
        } while (true);
        $stdout .= stream_get_contents($pipes[1]);
        $stderr .= stream_get_contents($pipes[2]);
        foreach ($pipes as $pipe) fclose($pipe);
        $exitCode = proc_close($process);
        if ($timedOut) {
            $stderr .= "\nZeitlimit erreicht.";
            $exitCode = 124;
        }
        return [substr($stdout, 0, self::MAX_OUTPUT_BYTES), substr($stderr, 0, self::MAX_OUTPUT_BYTES), $exitCode];
    }

    private function result(bool $success, bool $compiled, string $stdout, string $stderr, ?int $exitCode, float $started, string $status): array
    {
        return ['success' => $success, 'compiled' => $compiled, 'stdout' => $stdout, 'stderr' => $stderr, 'exitCode' => $exitCode, 'executionTime' => (int)round((microtime(true) - $started) * 1000), 'status' => $status];
    }

    private function removeDirectory(string $directory): void
    {
        foreach (glob($directory . '/*') ?: [] as $file) is_dir($file) ? $this->removeDirectory($file) : @unlink($file);
        @rmdir($directory);
    }
}

function javaRunner(): JavaRunner
{
    static $runner;
    if (!$runner) {
        $root = (string)(getenv('LINGUACODE_JAVA_WORKDIR') ?: sys_get_temp_dir() . '/linguacode-java');
        if (!is_dir($root)) @mkdir($root, 0700, true);
        $runner = new DockerJavaRunner(
            (string)(getenv('LINGUACODE_JAVA_DOCKER_IMAGE') ?: 'linguacode-java-runner:23'),
            $root,
            getenv('LINGUACODE_JAVA_RUNNER_ENABLED') === '1' && is_dir($root)
        );
    }
    return $runner;
}
