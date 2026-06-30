<?php
// json_db.php – Simple file‑based JSON storage helper

// Path to the JSON database file – defined in config.php as JSON_DB_FILE
if (!defined('JSON_DB_FILE')) {
    define('JSON_DB_FILE', __DIR__ . '/data.json');
}

// Log file for debugging
if (!defined('LOG_FILE')) {
    define('LOG_FILE', __DIR__ . '/error.log');
}

/** Log errors to file */
function log_error(string $message): void {
    $timestamp = date('Y-m-d H:i:s');
    $log = "[$timestamp] $message\n";
    file_put_contents(LOG_FILE, $log, FILE_APPEND);
}

/** Load the entire JSON database as an associative array */
function load_json_db(): array {
    try {
        if (!file_exists(JSON_DB_FILE)) {
            // Initialize empty structure with expected tables
            $init = [
                'students' => [], 
                'results' => [], 
                'staff' => [
                    ['id' => 1, 'name' => 'Mr Ajayi Reuben Opeyemi', 'role' => 'Proprietor', 'email' => '', 'staff_number' => 'STF0001'],
                    ['id' => 2, 'name' => 'Mrs Ajayi Tosin', 'role' => 'Head of Administration', 'email' => '', 'staff_number' => 'STF0002'],
                    ['id' => 3, 'name' => 'Mrs Bankole Tomilade', 'role' => 'Supervisor', 'email' => '', 'staff_number' => 'STF0003'],
                    ['id' => 4, 'name' => 'Mrs Adedigba Esther', 'role' => 'HOD for Social and Prevocational Study', 'email' => '', 'staff_number' => 'STF0004'],
                    ['id' => 5, 'name' => 'Mrs Ajayi Oluwaseun', 'role' => 'Director for Phonetic', 'email' => '', 'staff_number' => 'STF0005'],
                    ['id' => 6, 'name' => 'Mr Olalekan Wasiu', 'role' => 'Director of Coding and Robotics', 'email' => '', 'staff_number' => 'STF0006'],
                    ['id' => 7, 'name' => 'Admin', 'role' => 'Administrator', 'email' => '', 'staff_number' => 'ADMIN']
                ]
            ];
            if (!@file_put_contents(JSON_DB_FILE, json_encode($init, JSON_PRETTY_PRINT))) {
                throw new Exception('Failed to create database file at ' . JSON_DB_FILE);
            }
        }
        
        if (!is_readable(JSON_DB_FILE)) {
            throw new Exception('Database file is not readable: ' . JSON_DB_FILE);
        }
        
        $json = file_get_contents(JSON_DB_FILE);
        if ($json === false) {
            throw new Exception('Failed to read database file');
        }
        
        $data = json_decode($json, true);
        if (json_last_error() !== JSON_ERROR_NONE) {
            throw new Exception('JSON decode error: ' . json_last_error_msg());
        }
        
        if (!is_array($data)) {
            throw new Exception('Database file contains invalid data structure');
        }
        return $data;
    } catch (Exception $e) {
        log_error('load_json_db error: ' . $e->getMessage());
        throw $e;
    }
}

/** Persist the entire data structure back to the JSON file */
function save_json_db(array $data): void {
    try {
        $json = json_encode($data, JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES);
        if ($json === false) {
            throw new Exception('JSON encode error: ' . json_last_error_msg());
        }
        
        if (!@file_put_contents(JSON_DB_FILE, $json)) {
            throw new Exception('Failed to write to database file');
        }
    } catch (Exception $e) {
        log_error('save_json_db error: ' . $e->getMessage());
        throw $e;
    }
}

/** Simple query helper – returns rows that match all criteria */
function json_query(string $table, array $criteria = []): array {
    try {
        $db = load_json_db();
        if (!isset($db[$table])) {
            log_error("Table '$table' does not exist in database");
            return [];
        }
        
        $rows = $db[$table];
        foreach ($criteria as $key => $value) {
            $rows = array_filter($rows, function ($row) use ($key, $value) {
                return isset($row[$key]) && $row[$key] == $value;
            });
        }
        return array_values($rows);
    } catch (Exception $e) {
        log_error('json_query error: ' . $e->getMessage());
        throw $e;
    }
}

/** Insert a new record into a table – auto‑increments an integer id */
function json_insert(string $table, array $record): void {
    try {
        $db = load_json_db();
        if (!isset($db[$table])) {
            throw new Exception("Table '$table' does not exist");
        }
        
        $tableData = $db[$table] ?? [];
        $ids = array_column($tableData, 'id');
        $newId = $ids ? max($ids) + 1 : 1;
        $record['id'] = $newId;
        $tableData[] = $record;
        $db[$table] = $tableData;
        save_json_db($db);
    } catch (Exception $e) {
        log_error('json_insert error for table ' . $table . ': ' . $e->getMessage());
        throw $e;
    }
}

/** Update an existing record by id */
function json_update(string $table, int $id, array $updates): void {
    try {
        $db = load_json_db();
        if (!isset($db[$table])) {
            throw new Exception("Table '$table' does not exist");
        }
        
        $found = false;
        foreach ($db[$table] as &$row) {
            if ($row['id'] == $id) {
                $row = array_merge($row, $updates);
                $found = true;
                break;
            }
        }
        
        if (!$found) {
            throw new Exception("Record with id $id not found in table $table");
        }
        
        save_json_db($db);
    } catch (Exception $e) {
        log_error('json_update error: ' . $e->getMessage());
        throw $e;
    }
}

/** Delete a record by id – returns number of rows deleted (0 or 1) */
function json_delete(string $table, int $id): int {
    try {
        $db = load_json_db();
        if (!isset($db[$table])) {
            throw new Exception("Table '$table' does not exist");
        }
        
        $originalCount = count($db[$table]);
        $db[$table] = array_values(array_filter($db[$table], fn($row) => $row['id'] != $id));
        $deleted = $originalCount - count($db[$table]);
        save_json_db($db);
        return $deleted;
    } catch (Exception $e) {
        log_error('json_delete error: ' . $e->getMessage());
        throw $e;
    }
}
?>
