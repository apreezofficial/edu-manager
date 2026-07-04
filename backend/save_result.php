<?php
// backend/save_result.php – Relational results logging with student pivot check
header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

if ($_SERVER["REQUEST_METHOD"] === "OPTIONS") { http_response_code(204); exit; }
if ($_SERVER["REQUEST_METHOD"] !== "POST") { http_response_code(405); echo json_encode(["error" => "Method not allowed"]); exit; }

require_once __DIR__ . '/config.php';
require_once __DIR__ . '/json_db.php';

try {
    $raw = file_get_contents("php://input");
    $body = json_decode($raw, true);

    if (!$body) {
        http_response_code(400);
        echo json_encode(["error" => "Invalid JSON body"]);
        exit;
    }

    // Basic validation
    $required = ["id", "student", "admissionNumber", "classLevel", "term", "subject", "score", "grade", "remarks", "date"];
    foreach ($required as $field) {
        if (!isset($body[$field]) || (is_string($body[$field]) && trim($body[$field]) === "")) {
            http_response_code(400);
            echo json_encode(["error" => "Missing field: $field"]);
            exit;
        }
    }

    $admNo = strtoupper(trim($body["admissionNumber"]));
    $studentName = trim($body["student"]);
    $classLevel = trim($body["classLevel"]);

    $db = load_json_db();
    
    // Ensure tables exist
    if (!isset($db['students'])) $db['students'] = [];
    if (!isset($db['results'])) $db['results'] = [];

    // 1. Pivot check: Ensure the student exists in students list. If not, add them.
    $studentExistIndex = -1;
    foreach ($db['students'] as $idx => $s) {
         if (isset($s['admission_number']) && strtoupper(trim($s['admission_number'])) === $admNo) {
              $studentExistIndex = $idx;
              break;
         }
    }

    if ($studentExistIndex === -1) {
         $ids = array_column($db['students'], 'id');
         $newStudentId = $ids ? max($ids) + 1 : 1;
         $db['students'][] = [
             'id' => $newStudentId,
             'full_name' => $studentName,
             'admission_number' => $admNo,
             'class_level' => $classLevel,
             'active' => 1
         ];
    } else {
         $db['students'][$studentExistIndex]['full_name'] = $studentName;
         $db['students'][$studentExistIndex]['class_level'] = $classLevel;
    }

    // 2. Prep results record structure (relational: links by admissionNumber)
    $newResult = [
        "id" => $body["id"],
        "admissionNumber" => $admNo,
        "term" => $body["term"],
        "subject" => trim($body["subject"]),
        "score" => String($body["score"]),
        "grade" => $body["grade"],
        "remarks" => trim($body["remarks"]),
        "date" => $body["date"]
    ];

    $db['results'][] = $newResult;

    save_json_db($db);

    http_response_code(201);
    echo json_encode(["success" => true, "id" => $body["id"]]);

} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(["error" => "Failed to save result: " . $e->getMessage()]);
}
?>