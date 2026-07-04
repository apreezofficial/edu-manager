<?php
// backend/delete_result.php
header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

if ($_SERVER["REQUEST_METHOD"] === "OPTIONS") { http_response_code(204); exit; }
if ($_SERVER["REQUEST_METHOD"] !== "POST") { http_response_code(405); echo json_encode(["error" => "Method not allowed"]); exit; }

require_once __DIR__ . '/config.php';
require_once __DIR__ . '/json_db.php';

$body = json_decode(file_get_contents("php://input"), true);

if (!isset($body['pin']) || $body['pin'] !== 'APWERB12') {
    http_response_code(401);
    echo json_encode(['error' => 'Invalid PIN']);
    exit;
}

if (!isset($body["id"]) || trim($body["id"]) === "") {
    http_response_code(400);
    echo json_encode(["error" => "Missing id"]);
    exit;
}

try {
    $id = trim($body["id"]);
    $deleted = json_delete("results", $id);

    http_response_code(200);
    echo json_encode(["success" => true, "deleted" => $deleted, "message" => "Result deleted successfully"]);

} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(["error" => "Failed to delete result: " . $e->getMessage()]);
}
?>