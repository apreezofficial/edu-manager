<?php
// backend/validate_student.php – Validate student admission number
header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

if ($_SERVER["REQUEST_METHOD"] === "OPTIONS") { http_response_code(204); exit; }
if ($_SERVER["REQUEST_METHOD"] !== "POST")    { http_response_code(405); echo json_encode(["error" => "Method not allowed"]); exit; }

require_once __DIR__ . '/config.php';
require_once __DIR__ . '/json_db.php';

$body = json_decode(file_get_contents("php://input"), true);
$adm  = strtoupper(trim($body["admissionNumber"] ?? $body["admission_number"] ?? ""));

if (!$adm) {
    http_response_code(400);
    echo json_encode(["valid" => false, "error" => "No admission number provided"]);
    exit;
}

try {
    $rows = json_query('students', ['admission_number' => $adm]);
    $row = $rows[0] ?? null;

    if ($row) {
        echo json_encode([
            "valid" => true, 
            "name" => $row["full_name"] ?? "", 
            "classLevel" => $row["class_level"] ?? ""
        ]);
    } else {
        echo json_encode(["valid" => false, "error" => "Admission number not found"]);
    }

} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(["valid" => false, "error" => $e->getMessage()]);
}
?>