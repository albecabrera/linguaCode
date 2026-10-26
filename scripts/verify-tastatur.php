<?php
declare(strict_types=1);
require __DIR__ . '/../public/tastatur-teacher.php';
function check(bool $condition, string $message): void { if (!$condition) throw new RuntimeException($message); }
$db = new PDO('sqlite::memory:', null, null, [PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION]);
$db->exec(file_get_contents(__DIR__ . '/../database/schema.sql'));
$valid = validateKeyboardExercise(['title'=>'Umlaute','level'=>'4','texts'=>"Übung macht Spaß!\r\nIch heiße Max.\n"]);
check(count($valid['texts']) === 2, 'Line endings');
$id = storeKeyboardExercise($db, $valid, null);
check(keyboardExercise($db,$id)['title'] === 'Umlaute', 'Create/read');
$valid['title'] = 'Bearbeitet';storeKeyboardExercise($db,$valid,$id);
check(keyboardExercise($db,$id)['title'] === 'Bearbeitet', 'Update');
foreach ([['title'=>[], 'level'=>4, 'texts'=>'Hallo'],['title'=>'','level'=>4,'texts'=>'Hallo'],['title'=>'X','level'=>99,'texts'=>'Hallo'],['title'=>'X','level'=>4,'texts'=>'😀'],['title'=>'X','level'=>4,'texts'=>str_repeat('a',201)],['title'=>'X','level'=>4,'texts'=>str_repeat("Hallo\n",31)],['title'=>'X','level'=>4,'texts'=>"<script>alert(1)</script>\n\x01"]] as $invalid) {
    try { validateKeyboardExercise($invalid); throw new RuntimeException('Invalid data accepted'); } catch (InvalidArgumentException) {}
}
$db->prepare('DELETE FROM keyboard_exercises WHERE id=?')->execute([$id]);
check(keyboardExercise($db,$id) === false, 'Delete');
check((int)$db->query('SELECT COUNT(*) FROM exercises')->fetchColumn() === 0, 'Existing engine untouched');
echo "PASS: teacher validation, in-memory SQLite CRUD, existing engines isolated.\n";
