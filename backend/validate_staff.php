<?php
// backend/validate_staff.php – Validate staff number and return linked subjects
header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

if ($_SERVER["REQUEST_METHOD"] === "OPTIONS") { http_response_code(204); exit; }
if ($_SERVER["REQUEST_METHOD"] !== "POST")    { http_response_code(405); echo json_encode(["error" => "Method not allowed"]); exit; }

require_once __DIR__ . '/config.php';
require_once __DIR__ . '/json_db.php';

$body = json_decode(file_get_contents("php://input"), true);
$staffNo = strtoupper(trim($body["staffNumber"] ?? ""));

if (!$staffNo) {
    http_response_code(400);
    echo json_encode(["valid" => false, "error" => "No staff number provided"]);
    exit;
}

try {
    $rows = json_query('staff', ['staff_number' => $staffNo]);
    $row = $rows[0] ?? null;

    if ($row) {
        $subjects = is_array($row["subjects"] ?? null) ? $row["subjects"] : [];
        echo json_encode([
            "valid" => true, 
            "name" => $row["name"] ?? $row["full_name"] ?? "", 
            "role" => $row["role"] ?? "",
            "subjects" => $subjects
        ]);
    } else {
        echo json_encode(["valid" => false, "error" => "Invalid staff number"]);
    }

} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(["valid" => false, "error" => $e->getMessage()]);
}
?>