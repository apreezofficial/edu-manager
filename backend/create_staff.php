<?php
// backend/create_staff.php – Create a new staff record
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') { http_response_code(204); exit; }
if ($_SERVER['REQUEST_METHOD'] !== 'POST') { http_response_code(405); echo json_encode(['error' => 'Method not allowed']); exit; }

require_once __DIR__ . '/config.php';
require_once __DIR__ . '/json_db.php';

$body = json_decode(file_get_contents('php://input'), true);

if (!isset($body['pin']) || $body['pin'] !== 'APWERB12') {
    http_response_code(401);
    echo json_encode(['error' => 'Invalid PIN']);
    exit;
}

$required = ['name', 'role'];
foreach ($required as $f) {
    if (empty($body[$f])) {
        http_response_code(400);
        echo json_encode(['error' => "Missing field: $f"]);
        exit;
    }
}

$record = [
    'name'  => trim($body['name']),
    'role'  => trim($body['role']),
    'email' => isset($body['email']) ? trim($body['email']) : '',
    'staff_number' => 'STF' . str_pad(mt_rand(1000, 9999), 4, '0', STR_PAD_LEFT),
    'subjects' => is_array($body['subjects'] ?? null) ? $body['subjects'] : []
];

json_insert('staff', $record);

http_response_code(201);
echo json_encode([
    'success' => true, 
    'message' => 'Staff added successfully', 
    'staff_number' => $record['staff_number'],
    'data' => $record
]);
?>
