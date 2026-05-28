<?php
header('Access-Control-Allow-Origin: *');
header('Content-Type: application/json');
$filename = __DIR__ . '/results.json';
if (!file_exists($filename)) {
    file_put_contents($filename, json_encode([]));
}
$data = json_decode(file_get_contents($filename), true);
echo json_encode($data);
?>
