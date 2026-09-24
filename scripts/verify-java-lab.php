<?php
declare(strict_types=1);

$root = dirname(__DIR__);
$fail = static function (string $message): never { fwrite(STDERR, "FAIL: {$message}\n"); exit(1); };
$tasksPath = $root . '/pages/java/tasks.json';
$data = json_decode((string)file_get_contents($tasksPath), true);
if (!is_array($data) || count($data['lessons'] ?? []) !== 3) $fail('Es müssen genau drei Java-Lektionen vorhanden sein.');
$ids = [];
foreach ($data['lessons'] as $lesson) {
    if (!preg_match('/^1\.[1-3]$/', (string)$lesson['id'])) $fail('Ungültige Lektions-ID.');
    foreach ($lesson['tasks'] as $task) {
        if (isset($ids[$task['id']])) $fail('Aufgaben-ID doppelt: ' . $task['id']);
        $ids[$task['id']] = true;
        if (in_array($task['type'], ['code', 'completion'], true) && empty($task['hints'])) $fail('Aufgabe ohne Hinweise: ' . $task['id']);
    }
}
$runner = file_get_contents($root . '/public/java-runner.php');
foreach (['--network', 'none', '--memory', '128m', '--pids-limit', '--read-only', 'MAX_OUTPUT_BYTES', 'TIMEOUT_SECONDS'] as $marker) if (!str_contains($runner, $marker)) $fail('Security-Marker fehlt: ' . $marker);
foreach (['eval(', 'shell_exec(', 'system(', 'passthru('] as $unsafe) if (str_contains($runner, $unsafe)) $fail('Unsichere Ausführung gefunden: ' . $unsafe);
echo 'Java-Lab-Prüfung erfolgreich. ' . count($ids) . " Aufgaben geprüft.\n";
