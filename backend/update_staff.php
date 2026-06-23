<?php
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

if (!isset($body['id'])) {
    http_response_code(400);
    echo json_encode(['error' => 'Missing staff ID']);
    exit;
}

$updates = [];
if (isset($body['name'])) $updates['name'] = trim($body['name']);
if (isset($body['role'])) $updates['role'] = trim($body['role']);
if (isset($body['email'])) $updates['email'] = trim($body['email']);
if (isset($body['staff_number'])) $updates['staff_number'] = trim($body['staff_number']);

json_update('staff', (int)$body['id'], $updates);
echo json_encode(['success' => true, 'message' => 'Staff updated']);
?>