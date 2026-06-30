<?php
// backend/add_student.php – Add a new student record with error handling and logging

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
    // Read and validate JSON body
    $raw = file_get_contents('php://input');
    if (!$raw) {
        throw new Exception('Empty request body');
    }
    
    $body = json_decode($raw, true);
    if (!is_array($body)) {
        throw new Exception('Invalid JSON body: ' . json_last_error_msg());
    }
    
    // Validate required fields
    $required = ['admissionNumber', 'full_name', 'class_level'];
    $missing = [];
    
    foreach ($required as $field) {
        if (!isset($body[$field]) || trim((string)$body[$field]) === '') {
            $missing[] = $field;
        }
    }
    
    if (!empty($missing)) {
        http_response_code(400);
        echo json_encode([
            'success' => false,
            'error' => 'Missing required fields',
            'missing_fields' => $missing
        ]);
        exit;
    }
    
    // Prepare student record
    $record = [
        'admission_number' => strtoupper(trim($body['admissionNumber'])),
        'full_name'        => trim($body['full_name']),
        'class_level'      => trim($body['class_level']),
        'active'           => 1
    ];
    
    // Check if student already exists
    $existing = json_query('students', ['admission_number' => $record['admission_number']]);
    if (!empty($existing)) {
        http_response_code(409);
        echo json_encode([
            'success' => false,
            'error' => 'Student with this admission number already exists',
            'existing_student' => $existing[0]
        ]);
        exit;
    }
    
    // Insert the student record
    json_insert('students', $record);
    
    // Log success
    log_error('Student added successfully: ' . $record['admission_number'] . ' - ' . $record['full_name']);
    
    http_response_code(201);
    echo json_encode([
        'success' => true,
        'message' => 'Student added successfully',
        'data' => $record
    ]);

} catch (Exception $e) {
    // Log the error
    log_error('add_student.php error: ' . $e->getMessage());
    
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'error' => 'Failed to add student',
        'details' => $e->getMessage()
    ]);
}
?>
