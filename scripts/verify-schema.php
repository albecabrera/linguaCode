<?php
declare(strict_types=1);

$schema = file_get_contents(__DIR__ . '/../database/schema.sql');
if ($schema === false) throw new RuntimeException('Schema-Datei nicht lesbar.');

$db = new PDO('sqlite::memory:', null, null, [PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION]);
$db->exec($schema);
$tables = $db->query("SELECT name FROM sqlite_master WHERE type = 'table' ORDER BY name")->fetchAll(PDO::FETCH_COLUMN);
$expected = ['exercise_contents', 'exercise_sessions', 'exercises', 'external_resources', 'qr_links', 'sqlite_sequence'];
if ($tables !== $expected) throw new RuntimeException('Unerwartete Tabellen: ' . implode(', ', $tables));

$db->prepare('INSERT INTO exercises(subject,title,type,status,is_active) VALUES(?,?,?,?,?)')->execute(['informatik', 'Test', 'quiz', 'draft', 1]);
$exerciseId = (int)$db->lastInsertId();
$db->prepare('INSERT INTO exercise_contents(exercise_id,content_json) VALUES(?,?)')->execute([$exerciseId, '{"questions":[]}']);
$db->prepare('INSERT INTO qr_links(exercise_id,token) VALUES(?,?)')->execute([$exerciseId, 'test-token']);
$db->prepare('DELETE FROM exercises WHERE id=?')->execute([$exerciseId]);

if ((int)$db->query('SELECT COUNT(*) FROM exercise_contents')->fetchColumn() !== 0 || (int)$db->query('SELECT COUNT(*) FROM qr_links')->fetchColumn() !== 0) throw new RuntimeException('Cascade-Löschung fehlgeschlagen.');
echo "Schema-Prüfung erfolgreich.\n";
