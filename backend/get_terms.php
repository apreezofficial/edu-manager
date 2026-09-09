<?php
// backend/get_terms.php – Retrieve list of terms
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') { http_response_code(204); exit; }
if ($_SERVER['REQUEST_METHOD'] !== 'GET') { http_response_code(405); echo json_encode(['error' => 'Method not allowed']); exit; }

require_once __DIR__ . '/json_db.php';

try {
    $db = load_json_db();
    if (!isset($db['terms'])) {
        $db['terms'] = ["First Term", "Second Term", "Third Term"];
        save_json_db($db);
    }
    echo json_encode(['terms' => $db['terms']]);
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['error' => 'Failed to fetch terms: ' . $e->getMessage()]);
}
?>
