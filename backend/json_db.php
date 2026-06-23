<?php
// json_db.php – Simple file‑based JSON storage helper

// Path to the JSON database file – defined in config.php as JSON_DB_FILE
if (!defined('JSON_DB_FILE')) {
    // Fallback default location (should be overridden by config)
    define('JSON_DB_FILE', __DIR__ . '/data.json');
}

/** Load the entire JSON database as an associative array */
function load_json_db(): array {
    if (!file_exists(JSON_DB_FILE)) {
        // Initialise empty structure with expected tables and default staff
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
        file_put_contents(JSON_DB_FILE, json_encode($init, JSON_PRETTY_PRINT));
    }
    $json = file_get_contents(JSON_DB_FILE);
    $data = json_decode($json, true);
    if (!is_array($data)) {
        error('Corrupted JSON DB file');
    }
    return $data;
}

/** Persist the entire data structure back to the JSON file */
function save_json_db(array $data): void {
    file_put_contents(JSON_DB_FILE, json_encode($data, JSON_PRETTY_PRINT));
}

/** Simple query helper – returns rows that match all criteria */
function json_query(string $table, array $criteria = []): array {
    $db = load_json_db();
    $rows = $db[$table] ?? [];
    foreach ($criteria as $key => $value) {
        $rows = array_filter($rows, function ($row) use ($key, $value) {
            return isset($row[$key]) && $row[$key] == $value;
        });
    }
    return array_values($rows);
}

/** Insert a new record into a table – auto‑increments an integer id */
function json_insert(string $table, array $record): void {
    $db = load_json_db();
    $tableData = $db[$table] ?? [];
    $ids = array_column($tableData, 'id');
    $newId = $ids ? max($ids) + 1 : 1;
    $record['id'] = $newId;
    $tableData[] = $record;
    $db[$table] = $tableData;
    save_json_db($db);
}

/** Update an existing record by id */
function json_update(string $table, int $id, array $updates): void {
    $db = load_json_db();
    foreach ($db[$table] as &$row) {
        if ($row['id'] == $id) {
            $row = array_merge($row, $updates);
            break;
        }
    }
    save_json_db($db);
}

/** Delete a record by id – returns number of rows deleted (0 or 1) */
function json_delete(string $table, int $id): int {
    $db = load_json_db();
    $originalCount = count($db[$table]);
    $db[$table] = array_values(array_filter($db[$table], fn($row) => $row['id'] != $id));
    $deleted = $originalCount - count($db[$table]);
    save_json_db($db);
    return $deleted;
}
?>
