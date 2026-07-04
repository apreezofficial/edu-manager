<?php
// backend/add_subject.php – Add a new subject to the database
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') { http_response_code(204); exit; }

require_once __DIR__ . '/config.php';
require_once __DIR__ . '/json_db.php';

$body = json_decode(file_get_contents('php://input'), true);

if (!isset($body['pin']) || $body['pin'] !== 'APWERB12') {
    http_response_code(401);
    echo json_encode(['error' => 'Invalid PIN']);
    exit;
}

$subject = trim($body['subject'] ?? '');

if ($subject === '') {
    http_response_code(400);
    echo json_encode(['error' => 'Missing subject name']);
    exit;
}

try {
    $db = load_json_db();
    if (!isset($db['subjects'])) {
        $db['subjects'] = ["Mathematics", "English Language", "Basic Science", "Social Studies", "Yoruba", "CRS", "Physical Education", "Creative Arts", "Computer Studies"];
    }
    
    // Check duplicates case-insensitively
    $subjCaps = strtoupper($subject);
    foreach ($db['subjects'] as $s) {
        if (strtoupper($s) === $subjCaps) {
            http_response_code(409);
            echo json_encode(['error' => 'Subject already exists']);
            exit;
        }
    }
    
    $db['subjects'][] = $subject;
    save_json_db($db);

    echo json_encode(['success' => true, 'message' => 'Subject added successfully']);
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['error' => 'Failed to add subject: ' . $e->getMessage()]);
}
?>
