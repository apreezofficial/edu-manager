<?php
// backend/save_result.php
// Receives a JSON body and inserts a new result row

header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

if ($_SERVER["REQUEST_METHOD"] === "OPTIONS") { http_response_code(204); exit; }
if ($_SERVER["REQUEST_METHOD"] !== "POST") { http_response_code(405); echo json_encode(["error" => "Method not allowed"]); exit; }

require_once __DIR__ . '/config.php';
require_once __DIR__ . '/json_db.php';

$body = json_decode(file_get_contents("php://input"), true);

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

try {
    // Insert record into JSON DB
    $record = [
        "id" => $body["id"],
        "student_name" => trim($body["student"]),
        "admission_number" => strtoupper(trim($body["admissionNumber"])),
        "class_level" => $body["classLevel"],
        "term" => $body["term"],
        "subject" => trim($body["subject"]),
        "score" => (float)$body["score"],
        "grade" => $body["grade"],
        "remarks" => trim($body["remarks"]),
        "date_recorded" => $body["date"]
    ];
    json_insert("results", $record);

    http_response_code(201);
    echo json_encode(["success" => true, "id" => $body["id"]]);
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(["error" => "Failed to save result: " . $e->getMessage()]);
}