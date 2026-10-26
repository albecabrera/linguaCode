<?php
declare(strict_types=1);

/** Teacher exercises are separate from the four existing exercise engines. */
function validateKeyboardExercise(array $input): array {
    if (!is_string($input['title'] ?? null) || !is_string($input['texts'] ?? null) || !is_scalar($input['level'] ?? null)) throw new InvalidArgumentException('Ungültige Formularfelder.');
    if (strlen($input['texts']) > 24000) throw new InvalidArgumentException('Der Übungstext ist zu lang.');
    $title = trim((string)($input['title'] ?? ''));
    $level = filter_var($input['level'] ?? null, FILTER_VALIDATE_INT);
    $raw = str_replace(["\r\n", "\r"], "\n", (string)($input['texts'] ?? ''));
    if (preg_match('//u', $title . $raw) !== 1) throw new InvalidArgumentException('Bitte verwende gültigen UTF-8-Text.');
    $texts = array_values(array_filter(array_map('trim', explode("\n", $raw)), static fn($text) => $text !== ''));
    if ($title === '' || preg_match_all('/./us', $title) > 140) throw new InvalidArgumentException('Der Titel benötigt 1 bis 140 Zeichen.');
    if (!in_array($level, [2, 3, 4, 6], true)) throw new InvalidArgumentException('Bitte wähle eine gültige Schwierigkeit.');
    if (!$texts || count($texts) > 30) throw new InvalidArgumentException('Gib 1 bis 30 Wörter oder Sätze ein, jeweils in einer eigenen Zeile.');
    // All supported exercises must be writable on the displayed German T1 keyboard.
    foreach ($texts as $text) {
        if (preg_match_all('/./us', $text) > 200 || preg_match('/[^a-zA-ZäöüÄÖÜß0-9 !"§$%&\/()=?\\\\+*~#\x27<>|,;.:_\-@€µ²³{}\[\]]/u', $text)) {
            throw new InvalidArgumentException('Jede Zeile darf höchstens 200 Zeichen enthalten. Verwende Buchstaben, Zahlen und Zeichen der deutschen Tastatur (keine Emojis).');
        }
    }
    return ['title' => $title, 'level' => $level, 'texts' => $texts];
}
function keyboardExercise(PDO $db, int $id): array|false {
    $stmt = $db->prepare('SELECT * FROM keyboard_exercises WHERE id=?');
    $stmt->execute([$id]);
    return $stmt->fetch(PDO::FETCH_ASSOC);
}
function storeKeyboardExercise(PDO $db, array $content, ?int $id): int {
    $json = json_encode($content['texts'], JSON_UNESCAPED_UNICODE | JSON_THROW_ON_ERROR);
    if ($id === null) {
        $db->prepare('INSERT INTO keyboard_exercises(title,level,texts_json) VALUES(?,?,?)')->execute([$content['title'], $content['level'], $json]);
        return (int)$db->lastInsertId();
    }
    if (!keyboardExercise($db, $id)) throw new OutOfBoundsException('Übung nicht gefunden.');
    $db->prepare('UPDATE keyboard_exercises SET title=?,level=?,texts_json=?,updated_at=CURRENT_TIMESTAMP WHERE id=?')->execute([$content['title'], $content['level'], $json, $id]);
    return $id;
}
function keyboardTeacherRoute(string $path, string $method): void {
    if (!preg_match('#^/teacher/tastatur(?:/(\d+)(/data)?)?$#', $path, $match)) return;
    // The global local-development gate is permissive; private exercises never are.
    if (!teacherHash()) { http_response_code(503); exit('Lehrerzugang muss eingerichtet sein.'); }
    requireTeacher();
    header('Cache-Control: no-store');
    $db = db();
    $id = isset($match[1]) ? (int)$match[1] : null;
    $row = $id !== null ? keyboardExercise($db, $id) : null;
    if ($id !== null && !$row) { http_response_code(404); exit('Übung nicht gefunden.'); }
    if (!empty($match[2])) {
        if ($method !== 'GET') { http_response_code(405); header('Allow: GET'); exit('Nur GET ist erlaubt.'); }
        header('Content-Type: application/json; charset=utf-8');
        echo json_encode(['title'=>$row['title'], 'level'=>(int)$row['level'], 'texts'=>json_decode($row['texts_json'], true)], JSON_UNESCAPED_UNICODE);
        exit;
    }
    $error = '';
    if ($method === 'POST') {
        requireCsrf();
        if (($_POST['action'] ?? '') === 'delete') {
            if ($id === null) { http_response_code(422); exit('Übung fehlt.'); }
            $db->prepare('DELETE FROM keyboard_exercises WHERE id=?')->execute([$id]);
            redirect('/teacher/tastatur');
        }
        try {
            $content = validateKeyboardExercise($_POST);
            $saved = storeKeyboardExercise($db, $content, $id);
            redirect('/teacher/tastatur/' . $saved);
        } catch (InvalidArgumentException $exception) {
            http_response_code(422); $error = $exception->getMessage();
            $row = ['title'=>is_string($_POST['title'] ?? null) ? $_POST['title'] : '', 'level'=>is_scalar($_POST['level'] ?? null) ? (int)$_POST['level'] : 4, 'texts_json'=>json_encode(explode("\n", is_string($_POST['texts'] ?? null) ? $_POST['texts'] : ''))];
        }
    } elseif ($method !== 'GET') { http_response_code(405); header('Allow: GET, POST'); exit('Methode nicht erlaubt.'); }
    $all = $db->query('SELECT id,title,level FROM keyboard_exercises ORDER BY updated_at DESC,id DESC')->fetchAll(PDO::FETCH_ASSOC);
    ob_start(); ?>
    <section class="page-heading"><h1>Tastatur-Profi · Lehrerübungen</h1><p>Eigene Wörter und Sätze werden in der LinguaCode-Datenbank gespeichert. Keine Schülertexte oder Ergebnisse werden gespeichert.</p><p><a href="/tastatur/">Standardtrainer starten</a> · <a href="/teacher/tastatur">Neue Übung</a></p></section>
    <?php if ($error !== ''): ?><p role="alert"><?= h($error) ?></p><?php endif ?>
    <form class="editor" method="post"><input type="hidden" name="csrf" value="<?= h(csrf()) ?>">
    <label>Titel<input name="title" required maxlength="140" value="<?= h($row['title'] ?? '') ?>"></label>
    <label>Schwierigkeit<select name="level"><?php foreach ([2=>'Wörter',3=>'Groß- und Kleinschreibung',4=>'Sätze',6=>'Challenge'] as $level=>$label): ?><option value="<?= $level ?>" <?= (int)($row['level'] ?? 4) === $level ? 'selected' : '' ?>><?= h($label) ?></option><?php endforeach ?></select></label>
    <label>Eigene Wörter oder Sätze<textarea name="texts" rows="8" required maxlength="6030"><?= h($row ? implode("\n", json_decode($row['texts_json'], true)) : '') ?></textarea><small>Eine Aufgabe pro Zeile. Maximal 30 Aufgaben mit je 200 Zeichen.</small></label>
    <button type="submit">Speichern</button></form>
    <?php if ($id !== null): ?><p><a href="/tastatur/?exercise=<?= $id ?>">Gespeicherte Übung starten</a></p><form method="post"><input type="hidden" name="csrf" value="<?= h(csrf()) ?>"><input type="hidden" name="action" value="delete"><label><input type="checkbox" required> Ich möchte diese Übung endgültig löschen.</label><button type="submit">Übung löschen</button></form><?php endif ?>
    <section class="cards" style="margin-top:2rem"><?php foreach ($all as $exercise): ?><article class="card"><h2><?= h($exercise['title']) ?></h2><p>Stufe <?= (int)$exercise['level'] ?></p><div class="card-actions"><a href="/teacher/tastatur/<?= (int)$exercise['id'] ?>">Bearbeiten</a><a href="/tastatur/?exercise=<?= (int)$exercise['id'] ?>">Starten</a></div></article><?php endforeach ?></section>
    <p>Eigene Übungen starten im angemeldeten Lehrerbereich, etwa am Smartboard. Auf GitHub Pages stehen die sechs Standardstufen und freies Schreiben zur Verfügung.</p>
    <?php layout('Tastatur-Lehrerübungen', (string)ob_get_clean()); exit;
}
