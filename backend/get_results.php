<?php
// backend/get_results.php – Return all results with relational pivots from JSON
header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    exit;
}

require_once __DIR__ . '/config.php';
require_once __DIR__ . '/json_db.php';

try {
    $db = load_json_db();
    $results = $db['results'] ?? [];
    $students = $db['students'] ?? [];
    
    // Create map for easy lookup
    $studentMap = [];
    foreach ($students as $s) {
         if (isset($s['admission_number'])) {
             $studentMap[strtoupper(trim($s['admission_number']))] = $s;
         }
    }

    $adm = isset($_GET['adm']) ? trim($_GET['adm']) : null;
    $mapped = [];

    foreach ($results as $r) {
         $rAdm = isset($r['admissionNumber']) ? $r['admissionNumber'] : (isset($r['admission_number']) ? $r['admission_number'] : '');
         $rAdmCaps = strtoupper(trim($rAdm));

         if ($adm !== null && $rAdmCaps !== strtoupper(trim($adm))) {
             continue;
         }

         $student = isset($studentMap[$rAdmCaps]) ? $studentMap[$rAdmCaps] : null;

         $mapped[] = [
             'id' => isset($r['id']) ? $r['id'] : '',
             'student' => $student ? $student['full_name'] : 'Unknown Student',
             'admissionNumber' => $rAdm,
             'classLevel' => $student ? $student['class_level'] : 'Unknown Class',
             'term' => isset($r['term']) ? $r['term'] : '',
             'subject' => isset($r['subject']) ? $r['subject'] : '',
             'score' => isset($r['score']) ? (string)$r['score'] : '0',
             'grade' => isset($r['grade']) ? $r['grade'] : '-',
             'remarks' => isset($r['remarks']) ? $r['remarks'] : '-',
             'date' => isset($r['date']) ? $r['date'] : date('n/j/Y')
         ];
    }

    http_response_code(200);
    echo json_encode($mapped);

} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['error' => 'Failed to fetch results: ' . $e->getMessage()]);
}
?>