<?php
header('Content-Type: application/json');
if($_SERVER['REQUEST_METHOD'] !== 'POST'){
    http_response_code(405);
    echo json_encode(['error'=>'Method not allowed']);
    exit;
}

$input = json_decode(file_get_contents('php://input'), true);
if(!$input || !isset($input['name']) || !isset($input['class'])){
    http_response_code(400);
    echo json_encode(['error'=>'Invalid payload']);
    exit;
}

$file = __DIR__ . '/../enrollments.json';
$data = [];
if(file_exists($file)){
    $raw = file_get_contents($file);
    $data = json_decode($raw, true) ?? [];
}

$entry = [
    'id' => uniqid(),
    'name' => htmlspecialchars($input['name']),
    'class' => htmlspecialchars($input['class']),
    'timestamp' => date('c')
];
$data[] = $entry;
file_put_contents($file, json_encode($data, JSON_PRETTY_PRINT));

echo json_encode(['success'=>true,'entry'=>$entry]);
