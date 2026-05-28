<?php
header('Access-Control-Allow-Origin: *');
header('Content-Type: application/json');
$filename = __DIR__ . '/results.json';
// Truncate the file to an empty array
file_put_contents($filename, json_encode([], JSON_PRETTY_PRINT));
echo json_encode(['status' => 'cleared']);
?>
