<?php
header('Content-Type: application/json');
$filename = __DIR__ . '/results.json';
// Get posted data
$input = file_get_contents('php://input');
$newResult = json_decode($input, true);
if ($newResult === null) {
    http_response_code(400);
    echo json_encode(['error' => 'Invalid JSON']);
    exit;
}
// Load existing results
if (!file_exists($filename)) {
    $results = [];
} else {
    $results = json_decode(file_get_contents($filename), true);
    if (!is_array($results)) $results = [];
}
// Append new result at the beginning (most recent first)
array_unshift($results, $newResult);
// Save back
file_put_contents($filename, json_encode($results, JSON_PRETTY_PRINT));
echo json_encode(['status' => 'ok']);
?>
