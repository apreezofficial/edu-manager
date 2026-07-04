<?php
// backend/add_student.php – Add a new student record
require_once __DIR__ . '/config.php';
require_once __DIR__ . '/json_db.php';

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['success' => false, 'error' => 'Method not allowed']);
    exit;
}

try {
    $raw = file_get_contents('php://input');
    if (!$raw) {
        throw new Exception('Empty request body');
    }
    
    $body = json_decode($raw, true);
    if (!is_array($body)) {
        throw new Exception('Invalid JSON body');
    }
    
    // Validate PIN
    if (!isset($body['pin']) || $body['pin'] !== 'APWERB12') {
        http_response_code(401);
        echo json_encode(['success' => false, 'error' => 'Invalid or missing PIN']);
        exit;
    }

    $fullName = isset($body['full_name']) ? trim($body['full_name']) : '';
    $adm = '';
    if (isset($body['admission_number'])) {
        $adm = trim($body['admission_number']);
    } elseif (isset($body['admissionNumber'])) {
        $adm = trim($body['admissionNumber']);
    }
    $classLevel = isset($body['class_level']) ? trim($body['class_level']) : '';

    if ($fullName === '' || $adm === '' || $classLevel === '') {
        http_response_code(400);
        echo json_encode(['success' => false, 'error' => 'Missing required fields']);
        exit;
    }
    
    $record = [
        'admission_number' => strtoupper($adm),
        'full_name'        => $fullName,
        'class_level'      => $classLevel,
        'active'           => 1
    ];
    
    // Check if student already exists
    $existing = json_query('students', ['admission_number' => $record['admission_number']]);
    if (!empty($existing)) {
        http_response_code(409);
        echo json_encode([
            'success' => false,
            'error' => 'Student with this admission number already exists'
        ]);
        exit;
    }
    
    // Insert the student record
    json_insert('students', $record);
    
    http_response_code(201);
    echo json_encode([
        'success' => true,
        'message' => 'Student added successfully',
        'data' => $record
    ]);

} catch (Exception $e) {
    log_error('add_student.php error: ' . $e->getMessage());
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'error' => 'Failed to add student',
        'details' => $e->getMessage()
    ]);
}
?>
