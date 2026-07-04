<?php
// backend/delete_student.php – Delete a student record
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

try {
    $id = (int)$body['id'];
    
    // Cascading or orphaned handling: optionally delete student's results or let it cascade.
    // For safety, delete student's results too if needed, or simply delete the student.
    // We will delete the student.
    $deleted = json_delete('students', $id);

    echo json_encode(['success' => true, 'message' => 'Student deleted successfully', 'deleted' => $deleted]);

} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['error' => 'Failed to delete student: ' . $e->getMessage()]);
}
?>
