<?php
declare(strict_types=1);

const ROOT = __DIR__ . '/..';
const DB_PATH = ROOT . '/data/linguacode.sqlite';


function db(): PDO {
    static $db;
    if ($db instanceof PDO) return $db;
    $directory = dirname(DB_PATH);
    if (!is_dir($directory)) mkdir($directory, 0775, true);
    $isNew = !file_exists(DB_PATH);
    $db = new PDO('sqlite:' . DB_PATH, null, null, [PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION]);
    $db->exec('PRAGMA foreign_keys = ON');
    $db->exec(file_get_contents(ROOT . '/database/schema.sql'));
    if ($isNew) seed($db);
    seedExternalResources($db);
    return $db;
}

function seed(PDO $db): void {
    $db->prepare('INSERT INTO exercises(subject,title,description,type,status,is_active) VALUES(?,?,?,?,?,?)')
        ->execute(['spanisch', 'Saludos y presentaciones', 'Ein kurzer Einstieg in spanische Begrüßungen.', 'quiz', 'published', 1]);
    $id = (int)$db->lastInsertId();
    $content = ['questions' => [
        ['question' => 'Wie sagt man „Guten Morgen“ auf Spanisch?', 'options' => ['Buenas noches', 'Buenos días', 'Hasta luego', 'Gracias'], 'answer' => 1],
        ['question' => 'Was bedeutet „¿Cómo estás?“?', 'options' => ['Wo wohnst du?', 'Wie heißt du?', 'Wie geht es dir?', 'Wie alt bist du?'], 'answer' => 2],
        ['question' => 'Welche Verabschiedung passt?', 'options' => ['Adiós', 'Por favor', 'Hola', 'Sí'], 'answer' => 0],
    ]];
    $db->prepare('INSERT INTO exercise_contents(exercise_id,content_json) VALUES(?,?)')->execute([$id, json_encode($content, JSON_UNESCAPED_UNICODE)]);
    $db->prepare('INSERT INTO qr_links(exercise_id,token) VALUES(?,?)')->execute([$id, token()]);
}
function seedExternalResources(PDO $db): void {
    $db->prepare('INSERT INTO external_resources(subject,title,description,url,is_active) SELECT ?,?,?,?,? WHERE NOT EXISTS (SELECT 1 FROM external_resources WHERE url=?)')
        ->execute(['spanisch', 'Mapa interactivo de América Latina', 'Mapa interactivo para explorar América Latina.', 'https://albecabrera.github.io/mapa_americalatina_interactivo/', 1, 'https://albecabrera.github.io/mapa_americalatina_interactivo/']);
    $db->prepare('INSERT INTO external_resources(subject,title,description,url,is_active) SELECT ?,?,?,?,? WHERE NOT EXISTS (SELECT 1 FROM external_resources WHERE url=?)')
        ->execute(['informatik', 'Code Arena', 'App interactiva para practicar conceptos de programación.', 'https://albecabrera.github.io/code-arena-spiel/', 1, 'https://albecabrera.github.io/code-arena-spiel/']);
    $db->prepare('INSERT INTO external_resources(subject,title,description,url,is_active) SELECT ?,?,?,?,? WHERE NOT EXISTS (SELECT 1 FROM external_resources WHERE url=?)')
        ->execute(['spanisch', 'Escape Room: La composición', 'Escape room interactivo sobre la composición.', 'https://albecabrera.github.io/escape-room-lacomposicion/', 1, 'https://albecabrera.github.io/escape-room-lacomposicion/']);
    $db->prepare('INSERT INTO external_resources(subject,title,description,url,is_active) SELECT ?,?,?,?,? WHERE NOT EXISTS (SELECT 1 FROM external_resources WHERE url=?)')
        ->execute(['interdisziplinar', '5-Minuten Einmaleins-Test', 'Interaktiver Kurztest zum kleinen Einmaleins.', 'https://albecabrera.github.io/kleineseinmaleins/', 1, 'https://albecabrera.github.io/kleineseinmaleins/']);
    $db->prepare('INSERT INTO external_resources(subject,title,description,url,is_active) SELECT ?,?,?,?,? WHERE NOT EXISTS (SELECT 1 FROM external_resources WHERE url=?)')
        ->execute(['informatik', 'Caesar-Spiel', 'Interaktive Übung zur Caesar-Verschlüsselung.', 'https://albecabrera.github.io/caesar_spiel/', 1, 'https://albecabrera.github.io/caesar_spiel/']);
    $db->prepare('INSERT INTO external_resources(subject,title,description,url,is_active) SELECT ?,?,?,?,? WHERE NOT EXISTS (SELECT 1 FROM external_resources WHERE url=?)')
        ->execute(['interdisziplinar', 'Panel didáctico', 'Panel interactivo con materiales didácticos.', 'https://albecabrera.github.io/panel-didactico/', 1, 'https://albecabrera.github.io/panel-didactico/']);
}

function token(): string { return bin2hex(random_bytes(12)); }
function csrf(): string { return $_SESSION['csrf'] ??= bin2hex(random_bytes(24)); }
function requireCsrf(): void { if (!hash_equals(csrf(), (string)($_POST['csrf'] ?? ''))) { http_response_code(419); exit('Ungültige Anfrage. Bitte lade die Seite neu.'); } }
function teacherHash(): string { return (string)getenv('LINGUACODE_TEACHER_PASSWORD_HASH'); }
function isTeacher(): bool { return ($_SESSION['teacher'] ?? false) === true; }
function requireTeacher(): void { if (!teacherHash()) { http_response_code(503); layout('Einrichtung erforderlich', '<section class="notice"><h1>Lehrerbereich noch nicht eingerichtet.</h1><p>Setze auf dem Server <code>LINGUACODE_TEACHER_PASSWORD_HASH</code>.</p></section>', true); exit; } if (!isTeacher()) redirect('/login'); }
function baseUrl(): string {
    $scheme = (!empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off') ? 'https' : 'http';
    return $scheme . '://' . ($_SERVER['HTTP_HOST'] ?? 'localhost');
}
function h(string $value): string { return htmlspecialchars($value, ENT_QUOTES, 'UTF-8'); }
function redirect(string $path): never { header('Location: ' . $path, true, 303); exit; }
function input(string $key, string $default = ''): string { return trim((string)($_POST[$key] ?? $default)); }
function exerciseContent(array $exercise): array { return json_decode((string)$exercise['content_json'], true, 512, JSON_THROW_ON_ERROR); }
function validateContent(string $type, array $content): void {
    if ($type === 'quiz') {
        if (empty($content['questions']) || !is_array($content['questions'])) throw new InvalidArgumentException('Ein Quiz benötigt mindestens eine Frage.');
        foreach ($content['questions'] as $question) {
            if (!is_array($question) || empty($question['question']) || !isset($question['options']) || !is_array($question['options']) || count($question['options']) < 2 || !isset($question['answer']) || !is_int($question['answer']) || $question['answer'] < 0 || $question['answer'] >= count($question['options'])) throw new InvalidArgumentException('Jede Quizfrage braucht mindestens zwei Antworten und einen gültigen Lösungsindex.');
        }
        return;
    }
    if (in_array($type, ['memory', 'matching'], true)) {
        if (empty($content['pairs']) || !is_array($content['pairs'])) throw new InvalidArgumentException('Diese Übung benötigt mindestens ein Paar.');
        foreach ($content['pairs'] as $pair) if (!is_array($pair) || empty($pair['left']) || empty($pair['right'])) throw new InvalidArgumentException('Jedes Paar benötigt einen linken und einen rechten Wert.');
        return;
    }
    if ($type === 'cloze') {
        if (!isset($content['text'], $content['blanks']) || !is_string($content['text']) || !is_array($content['blanks']) || !count($content['blanks']) || substr_count($content['text'], '{{') !== count($content['blanks'])) throw new InvalidArgumentException('Ein Lückentext benötigt Text mit {{0}}, {{1}} usw. und gleich viele Lösungen.');
        foreach ($content['blanks'] as $blank) if (!is_string($blank) || trim($blank) === '') throw new InvalidArgumentException('Keine Lösung darf leer sein.');
    }
}

function layout(string $title, string $body, bool $public = false): void {
    $nav = $public ? '<a class="brand" href="/">Lingua<span>Code</span></a>' : '<a class="brand" href="/">Lingua<span>Code</span></a><a class="nav-link" href="/exercise/new">+ Übung anlegen</a>';
    echo '<!doctype html><html lang="de"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="theme-color" content="#19252f"><link rel="manifest" href="/manifest.webmanifest"><link rel="stylesheet" href="/assets/app.css"><link rel="stylesheet" href="/assets/dashboard.css"><title>' . h($title) . ' · LinguaCode</title></head><body><header><nav>' . $nav . '</nav></header><main>' . $body . '</main><script src="/assets/qrcode-generator.min.js" defer></script><script src="/assets/app.js" defer></script></body></html>';
}

function dashboard(): void {
    $subject = $_GET['subject'] ?? '';
    $type = $_GET['type'] ?? '';
    $where = []; $values = [];
    if (in_array($subject, ['spanisch', 'informatik'], true)) { $where[] = 'e.subject = ?'; $values[] = $subject; }
    if (in_array($type, ['quiz', 'memory', 'matching', 'cloze'], true)) { $where[] = 'e.type = ?'; $values[] = $type; }
    $sql = 'SELECT e.*, q.token FROM exercises e LEFT JOIN qr_links q ON q.exercise_id=e.id' . ($where ? ' WHERE ' . implode(' AND ', $where) : '') . ' ORDER BY e.updated_at DESC';
    $stmt = db()->prepare($sql); $stmt->execute($values); $exercises = $stmt->fetchAll(PDO::FETCH_ASSOC);
    $externalSql = 'SELECT * FROM external_resources WHERE is_active=1'; $externalValues = [];
    if (in_array($subject, ['spanisch', 'informatik'], true)) { $externalSql .= ' AND subject=?'; $externalValues[] = $subject; }
    $externalSql .= ' ORDER BY title'; $externalStmt = db()->prepare($externalSql); $externalStmt->execute($externalValues); $external = $externalStmt->fetchAll(PDO::FETCH_ASSOC);
    ob_start(); ?>
    <section class="hero"><p class="eyebrow">Lehrerbereich</p><h1>Übungen, klar organisiert.</h1><p>Erstellen, freigeben und direkt im Unterricht einsetzen.</p></section>
    <form class="filters" method="get"><label>Fach <select name="subject"><option value="">Alle Fächer</option><option value="spanisch" <?= $subject === 'spanisch' ? 'selected' : '' ?>>Spanisch</option><option value="informatik" <?= $subject === 'informatik' ? 'selected' : '' ?>>Informatik</option></select></label><label>Typ <select name="type"><option value="">Alle Typen</option><?php foreach(['quiz'=>'Quiz','memory'=>'Memory','matching'=>'Zuordnung','cloze'=>'Lückentext'] as $key=>$label): ?><option value="<?= $key ?>" <?= $type === $key ? 'selected' : '' ?>><?= $label ?></option><?php endforeach ?></select></label><button class="secondary">Filtern</button></form>
    <section class="cards"><?php foreach ($exercises as $e): $url = $e['token'] ? baseUrl() . '/e/' . $e['token'] : ''; ?><article class="card"><div class="card-top"><span class="tag"><?= h(ucfirst($e['subject'])) ?></span><span class="status <?= h($e['status']) ?>"><?= $e['status'] === 'published' ? 'Veröffentlicht' : 'Entwurf' ?></span></div><h2><?= h($e['title']) ?></h2><p><?= h($e['description']) ?: 'Ohne Beschreibung' ?></p><p class="meta"><?= h(['quiz'=>'Quiz','memory'=>'Memory','matching'=>'Zuordnung','cloze'=>'Lückentext'][$e['type']]) ?> · <?= $e['is_active'] ? 'aktiv' : 'pausiert' ?></p><div class="card-actions"><a href="/exercise/<?= $e['id'] ?>/edit">Bearbeiten</a><a href="/exercise/<?= $e['id'] ?>/preview" target="_blank" rel="noopener">Vorschau</a><?php if ($url && $e['status'] === 'published' && $e['is_active']): ?><button class="link-button" data-share-url="<?= h($url) ?>">Link / QR</button><?php endif ?></div></article><?php endforeach; if (!$exercises): ?><p class="empty">Noch keine passende Übung.</p><?php endif ?></section>
    <?php if ($external): ?><section class="external-section"><p class="eyebrow">Externe Apps</p><h2>Bestehende interaktive Angebote</h2><div class="cards"><?php foreach ($external as $resource): ?><article class="card"><div class="card-top"><span class="tag"><?= h(ucfirst($resource['subject'])) ?></span><span class="status">Externe App</span></div><h2><?= h($resource['title']) ?></h2><p><?= h($resource['description']) ?></p><div class="card-actions"><a href="<?= h($resource['url']) ?>" target="_blank" rel="noopener">Öffnen</a><button class="link-button" data-share-url="<?= h($resource['url']) ?>">Link / QR</button></div></article><?php endforeach ?></div></section><?php endif ?>
    <dialog id="share-dialog"><button class="dialog-close" aria-label="Schließen">×</button><h2>Freigabe</h2><p>Öffne oder teile diesen Link. Der QR-Code enthält keine Schülerdaten.</p><img id="qr-image" alt="QR-Code zur Übung"><input id="share-url" readonly><button id="copy-url">Link kopieren</button></dialog>
    <?php layout('Dashboard', (string)ob_get_clean());
}

function form(?array $exercise = null): void {
    $editing = $exercise !== null;
    $content = $editing ? json_encode(exerciseContent($exercise), JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE) : json_encode(['questions'=>[['question'=>'', 'options'=>['','','',''], 'answer'=>0]]], JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE);
    ob_start(); ?>
    <section class="page-heading"><p class="eyebrow">Lehrerbereich</p><h1><?= $editing ? 'Übung bearbeiten' : 'Neue Übung anlegen' ?></h1><p>Inhalte bleiben von der Spiel-Engine getrennt und werden als strukturierte Daten gespeichert.</p></section>
    <form class="editor" method="post" action="<?= $editing ? '/exercise/' . $exercise['id'] : '/exercise' ?>"><input type="hidden" name="csrf" value="<?= h(csrf()) ?>"><label>Fach<select name="subject" required><option value="spanisch" <?= ($exercise['subject'] ?? '') === 'spanisch' ? 'selected' : '' ?>>Spanisch</option><option value="informatik" <?= ($exercise['subject'] ?? '') === 'informatik' ? 'selected' : '' ?>>Informatik</option></select></label><label>Titel<input name="title" required maxlength="140" value="<?= h($exercise['title'] ?? '') ?>"></label><label>Beschreibung<textarea name="description" maxlength="500"><?= h($exercise['description'] ?? '') ?></textarea></label><label>Übungstyp<select name="type"><option value="quiz" <?= ($exercise['type'] ?? '') === 'quiz' ? 'selected' : '' ?>>Quiz</option><option value="memory" <?= ($exercise['type'] ?? '') === 'memory' ? 'selected' : '' ?>>Memory</option><option value="matching" <?= ($exercise['type'] ?? '') === 'matching' ? 'selected' : '' ?>>Zuordnung</option><option value="cloze" <?= ($exercise['type'] ?? '') === 'cloze' ? 'selected' : '' ?>>Lückentext</option></select></label><label>Status<select name="status"><option value="draft" <?= ($exercise['status'] ?? 'draft') === 'draft' ? 'selected' : '' ?>>Entwurf</option><option value="published" <?= ($exercise['status'] ?? '') === 'published' ? 'selected' : '' ?>>Veröffentlicht</option></select></label><label class="switch"><input type="checkbox" name="is_active" value="1" <?= (!$editing || $exercise['is_active']) ? 'checked' : '' ?>> Übung aktiv</label><label>Inhalte (JSON)<textarea class="code" name="content_json" required><?= h($content) ?></textarea><small>Quiz-Format: <code>{"questions":[{"question":"…","options":["…"],"answer":0}]}</code></small></label><div class="form-actions"><a class="secondary" href="/">Abbrechen</a><button>Speichern</button></div></form>
    <?php layout($editing ? 'Übung bearbeiten' : 'Neue Übung', (string)ob_get_clean());
}

function renderExercise(array $exercise): void {
    $content = exerciseContent($exercise);
    ob_start(); ?><section class="exercise" data-engine="<?= h($exercise['type']) ?>" data-content='<?= h(json_encode($content, JSON_UNESCAPED_UNICODE)) ?>'><p class="eyebrow"><?= h(ucfirst($exercise['subject'])) ?> · <?= h(['quiz'=>'Quiz','memory'=>'Memory','matching'=>'Zuordnung','cloze'=>'Lückentext'][$exercise['type']]) ?></p><h1><?= h($exercise['title']) ?></h1><p><?= h($exercise['description']) ?></p><div id="exercise-engine" aria-live="polite"></div></section><?php layout(h($exercise['title']), (string)ob_get_clean(), true);
}
function publicExercise(string $token): void {
    $stmt = db()->prepare('SELECT e.*, c.content_json FROM qr_links q JOIN exercises e ON e.id=q.exercise_id JOIN exercise_contents c ON c.exercise_id=e.id WHERE q.token=? AND e.status="published" AND e.is_active=1');
    $stmt->execute([$token]); $exercise = $stmt->fetch(PDO::FETCH_ASSOC);
    if (!$exercise) { http_response_code(404); layout('Nicht verfügbar', '<section class="notice"><h1>Diese Übung ist nicht verfügbar.</h1><p>Bitte prüfe den Link oder frage deine Lehrkraft.</p></section>', true); return; }
    renderExercise($exercise);
}
function previewExercise(int $id): void { $stmt = db()->prepare('SELECT e.*, c.content_json FROM exercises e JOIN exercise_contents c ON c.exercise_id=e.id WHERE e.id=?'); $stmt->execute([$id]); $exercise = $stmt->fetch(PDO::FETCH_ASSOC); if (!$exercise) { http_response_code(404); exit('Nicht gefunden.'); } renderExercise($exercise); }

function saveExercise(?int $id = null): void {
    $subject = input('subject'); $type = input('type'); $status = input('status'); $title = input('title'); $description = input('description');
    if (!in_array($subject, ['spanisch','informatik'], true) || !in_array($type, ['quiz','memory','matching','cloze'], true) || !in_array($status, ['draft','published'], true) || $title === '') { http_response_code(422); exit('Ungültige Eingabe.'); }
    try { $content = json_decode(input('content_json'), true, 512, JSON_THROW_ON_ERROR); validateContent($type, $content); } catch (JsonException $e) { http_response_code(422); exit('Der Inhalt ist kein gültiges JSON.'); } catch (InvalidArgumentException $e) { http_response_code(422); exit(h($e->getMessage())); }
    $db = db(); $db->beginTransaction();
    try { if ($id === null) { $db->prepare('INSERT INTO exercises(subject,title,description,type,status,is_active) VALUES(?,?,?,?,?,?)')->execute([$subject,$title,$description,$type,$status,isset($_POST['is_active']) ? 1 : 0]); $id = (int)$db->lastInsertId(); $db->prepare('INSERT INTO qr_links(exercise_id,token) VALUES(?,?)')->execute([$id,token()]); } else { $db->prepare('UPDATE exercises SET subject=?,title=?,description=?,type=?,status=?,is_active=?,updated_at=CURRENT_TIMESTAMP WHERE id=?')->execute([$subject,$title,$description,$type,$status,isset($_POST['is_active']) ? 1 : 0,$id]); } $db->prepare('INSERT INTO exercise_contents(exercise_id,content_json,updated_at) VALUES(?,?,CURRENT_TIMESTAMP) ON CONFLICT(exercise_id) DO UPDATE SET content_json=excluded.content_json,updated_at=CURRENT_TIMESTAMP')->execute([$id,json_encode($content, JSON_UNESCAPED_UNICODE)]); $db->commit(); } catch(Throwable $e) { $db->rollBack(); throw $e; }
    redirect('/exercise/' . $id . '/edit');
}

$method = $_SERVER['REQUEST_METHOD'] ?? 'GET'; $path = rtrim(parse_url($_SERVER['REQUEST_URI'] ?? '/', PHP_URL_PATH) ?: '/', '/') ?: '/';
if (!str_starts_with($path, '/e/')) { session_set_cookie_params(['httponly' => true, 'samesite' => 'Lax', 'secure' => !empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off']); session_start(); }
if ($path === '/login') {
    if (!teacherHash()) { http_response_code(503); layout('Einrichtung erforderlich', '<section class="notice"><h1>Lehrerbereich noch nicht eingerichtet.</h1><p>Setze auf dem Server <code>LINGUACODE_TEACHER_PASSWORD_HASH</code>.</p></section>', true); exit; }
    $error = '';
    if ($method === 'POST') { requireCsrf(); if (password_verify((string)($_POST['password'] ?? ''), teacherHash())) { session_regenerate_id(true); $_SESSION['teacher'] = true; redirect('/'); } $error = '<p class="feedback">Passwort nicht korrekt.</p>'; }
    layout('Anmelden', '<section class="notice"><p class="eyebrow">Lehrerbereich</p><h1>Anmelden</h1>' . $error . '<form class="editor" method="post"><input type="hidden" name="csrf" value="' . h(csrf()) . '"><label>Passwort<input type="password" name="password" required autofocus autocomplete="current-password"></label><button>Anmelden</button></form></section>', true); exit;
}
if ($path === '/logout' && $method === 'POST') { requireCsrf(); $_SESSION = []; session_destroy(); redirect('/login'); }
if ($method === 'POST' && $path === '/exercise') { requireCsrf(); saveExercise(); }
if ($method === 'POST' && preg_match('#^/exercise/(\d+)$#', $path, $m)) { requireCsrf(); saveExercise((int)$m[1]); }
if ($path === '/') { dashboard(); exit; }
if ($path === '/exercise/new') { form(); exit; }
if (preg_match('#^/exercise/(\d+)/preview$#', $path, $m)) { previewExercise((int)$m[1]); exit; }
if (preg_match('#^/exercise/(\d+)/edit$#', $path, $m)) { $stmt=db()->prepare('SELECT e.*,c.content_json FROM exercises e JOIN exercise_contents c ON c.exercise_id=e.id WHERE e.id=?'); $stmt->execute([(int)$m[1]]); $exercise=$stmt->fetch(PDO::FETCH_ASSOC); if(!$exercise){http_response_code(404);exit('Nicht gefunden.');} form($exercise); exit; }
if (preg_match('#^/e/([a-f0-9]{24})$#', $path, $m)) { publicExercise($m[1]); exit; }
http_response_code(404); layout('Nicht gefunden', '<section class="notice"><h1>Seite nicht gefunden.</h1></section>');
