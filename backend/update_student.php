<?php
// backend/update_student.php – Update a student record
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
    echo json_encode(['error' => 'Missing student ID']);
    exit;
}

$id = (int)$body['id'];
$fullName = isset($body['full_name']) ? trim($body['full_name']) : '';
$adm = isset($body['admission_number']) ? trim($body['admission_number']) : '';
$classLevel = isset($body['class_level']) ? trim($body['class_level']) : '';

if ($fullName === '' || $adm === '' || $classLevel === '') {
    http_response_code(400);
    echo json_encode(['error' => 'Missing required fields']);
    exit;
}

try {
    $admCaps = strtoupper($adm);
    
    // Check duplicates
    $allStudents = json_query('students');
    foreach ($allStudents as $s) {
        if ($s['id'] != $id && isset($s['admission_number']) && strtoupper(trim($s['admission_number'])) === $admCaps) {
            http_response_code(409);
            echo json_encode(['error' => 'Another student with this admission number already exists']);
            exit;
        }
    }

    $updates = [
        'full_name' => $fullName,
        'admission_number' => $admCaps,
        'class_level' => $classLevel
    ];
    if (isset($body['active'])) {
        $updates['active'] = (int)$body['active'];
    }

    json_update('students', $id, $updates);

    echo json_encode(['success' => true, 'message' => 'Student updated successfully']);

} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['error' => 'Failed to update student: ' . $e->getMessage()]);
}
?>
