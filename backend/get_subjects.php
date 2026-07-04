<?php
// backend/get_subjects.php – Fetch list of subjects
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') { http_response_code(204); exit; }

require_once __DIR__ . '/json_db.php';

try {
    $db = load_json_db();
    if (!isset($db['subjects'])) {
        $db['subjects'] = ["Mathematics", "English Language", "Basic Science", "Social Studies", "Yoruba", "CRS", "Physical Education", "Creative Arts", "Computer Studies"];
        save_json_db($db);
    }
    echo json_encode($db['subjects']);
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['error' => 'Failed to fetch subjects: ' . $e->getMessage()]);
}
?>
