<?php
// backend/add_student.php – Add a new student record
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') { http_response_code(204); exit; }
if ($_SERVER['REQUEST_METHOD'] !== 'POST') { http_response_code(405); echo json_encode(['error' => 'Method not allowed']); exit; }

require_once __DIR__ . '/config.php';
require_once __DIR__ . '/json_db.php';

$body = json_decode(file_get_contents('php://input'), true);
$required = ['admissionNumber', 'full_name', 'class_level'];
foreach ($required as $f) {
    if (empty($body[$f])) {
        http_response_code(400);
        echo json_encode(['error' => "Missing field: $f"]);
        exit;
    }
}

$record = [
    'admission_number' => strtoupper(trim($body['admissionNumber'])),
    'full_name'        => trim($body['full_name']),
    'class_level'      => $body['class_level'],
    'active'           => 1
];
json_insert('students', $record);

http_response_code(201);
echo json_encode(['success' => true, 'message' => 'Student added']);
?>
