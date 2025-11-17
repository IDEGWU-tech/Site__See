<?php
// Simple PHP endpoint (demo) to accept booking JSON and insert into MySQL
// Note: This is a minimal example. Validate/sanitize inputs and secure DB in production.

header('Content-Type: application/json');
$raw = file_get_contents('php://input');
if (!$raw) {
    echo json_encode(['status'=>'error','message'=>'No data']);
    http_response_code(400);
    exit;
}
$data = json_decode($raw, true);
if (!$data) {
    echo json_encode(['status'=>'error','message'=>'Invalid JSON']);
    http_response_code(400);
    exit;
}

// Example: write to MySQL using PDO (credentials need to be set)
$host = '127.0.0.1';
$db   = 'site_see';
$user = 'root';
$pass = '';
$charset = 'utf8mb4';
$dsn = "mysql:host=$host;dbname=$db;charset=$charset";
$options = [
    PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
    PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
];
try {
    $pdo = new PDO($dsn, $user, $pass, $options);
    $stmt = $pdo->prepare('INSERT INTO bookings (external_id, name, email, date, time, guests, notes) VALUES (?, ?, ?, ?, ?, ?, ?)');
    $stmt->execute([
        $data['id'] ?? null,
        $data['name'] ?? null,
        $data['email'] ?? null,
        $data['date'] ?? null,
        $data['time'] ?? null,
        $data['guests'] ?? null,
        $data['notes'] ?? null,
    ]);
    echo json_encode(['status'=>'ok']);
} catch (Exception $e) {
    // In demo, return error but don't expose sensitive info in prod
    http_response_code(500);
    echo json_encode(['status'=>'error','message'=>$e->getMessage()]);
}
