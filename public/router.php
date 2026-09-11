<?php
declare(strict_types=1);

$path = parse_url($_SERVER['REQUEST_URI'] ?? '/', PHP_URL_PATH) ?: '/';
$path = rtrim($path, '/') ?: '/';
if ($path === '/automaten' || str_starts_with($path, '/automaten/')) {
    $relativePath = $path === '/automaten' ? '/index.html' : substr($path, strlen('/automaten'));
    $file = realpath(__DIR__ . '/../pages/automaten' . $relativePath);
    $root = realpath(__DIR__ . '/../pages/automaten');
    if ($file === false || $root === false || !str_starts_with($file, $root . DIRECTORY_SEPARATOR) || !is_file($file)) {
        http_response_code(404);
        exit('Nicht gefunden.');
    }
    header('Content-Type: ' . (mime_content_type($file) ?: 'application/octet-stream'));
    readfile($file);
    exit;
}
if ($path === '/eva' || str_starts_with($path, '/eva/')) {
    $relativePath = $path === '/eva' ? '/index.html' : substr($path, strlen('/eva'));
    $file = realpath(__DIR__ . '/../pages/eva' . $relativePath);
    $root = realpath(__DIR__ . '/../pages/eva');
    if ($file === false || $root === false || !str_starts_with($file, $root . DIRECTORY_SEPARATOR) || !is_file($file)) {
        http_response_code(404);
        exit('Nicht gefunden.');
    }
    header('Content-Type: ' . (mime_content_type($file) ?: 'application/octet-stream'));
    readfile($file);
    exit;
}
$file = __DIR__ . $path;
if ($path !== '/' && is_file($file)) {
    return false;
}
require __DIR__ . '/index.php';
