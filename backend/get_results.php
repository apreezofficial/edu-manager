<?php
// backend/get_results.php – Return all results from JSON storage
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');
// Set CORS and JSON headers
set_headers('GET');
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    exit;
}

require_once __DIR__ . '/json_db.php';

$adm = isset($_GET['adm']) ? trim($_GET['adm']) : null;

if ($adm) {
    $rows = json_query('results', ['admission_number' => $adm]);
} else {
    $rows = json_query('results'); // get all
}

// Map fields to camelCase for frontend consistency
$mapped = array_map(function($r){
    return [
        'id' => $r['id'] ?? '',
        'student' => $r['student_name'] ?? '',
        'admissionNumber' => $r['admission_number'] ?? '',
        'classLevel' => $r['class_level'] ?? '',
        'term' => $r['term'] ?? '',
        'subject' => $r['subject'] ?? '',
        'score' => (string)($r['score'] ?? '0'),
        'grade' => $r['grade'] ?? '-',
        'remarks' => $r['remarks'] ?? '—',
        'date' => $r['date_recorded'] ?? date('n/j/Y'),
    ];
}, $rows);

http_response_code(200);
echo json_encode($mapped);
?>