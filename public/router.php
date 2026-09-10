<?php
declare(strict_types=1);

$path = parse_url($_SERVER['REQUEST_URI'] ?? '/', PHP_URL_PATH) ?: '/';
$path = rtrim($path, '/') ?: '/';
if ($path === '/automaten') {
    header('Content-Type: text/html; charset=UTF-8');
    readfile(__DIR__ . '/automaten/index.html');
    exit;
}
$file = __DIR__ . $path;
if ($path !== '/' && is_file($file)) {
    return false;
}
require __DIR__ . '/index.php';
