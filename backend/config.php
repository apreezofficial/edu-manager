<?php
// backend/config.php
// ============================================================
//  Delightsome Kids School — Central Configuration
//  Edit ONLY this file to change database credentials.
//  All other PHP files include this automatically.
// ============================================================

// ── Database ─────────────────────────────────────────────────
// MySQL configuration (retained for potential migration)
define("DB_HOST", "localhost");
define("DB_NAME", "delightsome_db");
define("DB_USER", "root");
define("DB_PASS", "");
define("DB_CHARSET", "utf8mb4");

// JSON file‑based storage configuration
define("DB_DRIVER", "json"); // "json" or "mysql"
define("JSON_DB_FILE", __DIR__ . "/data.json");

// ── App settings ─────────────────────────────────────────────
define("APP_NAME", "Delightsome Kids School");
define("APP_ENV",  "production");     // "development" | "production"

// ── CORS origin ──────────────────────────────────────────────
// Set to your exact frontend URL in production, e.g. "https://delightsome.edu.ng"
// Use "*" only during local development
define("CORS_ORIGIN", "*");

// ── Error display ────────────────────────────────────────────
// Shows full errors in development, hides them in production
if (APP_ENV === "development") {
    ini_set("display_errors", 1);
    ini_set("display_startup_errors", 1);
    error_reporting(E_ALL);
} else {
    ini_set("display_errors", 0);
    error_reporting(0);
}
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

// ── Shared DB connection factory ─────────────────────────────
// Every PHP file calls get_db() instead of repeating the PDO block
function get_db(): PDO {
    if (defined('DB_DRIVER') && DB_DRIVER === 'json') {
        // JSON driver does not use PDO; indicate unsupported usage
        throw new Exception('JSON driver does not provide a PDO connection.');
    }

    static $pdo = null;
    if ($pdo !== null) return $pdo;

    $dsn = "mysql:host=" . DB_HOST
         . ";dbname=" . DB_NAME
         . ";charset=" . DB_CHARSET;

    $pdo = new PDO($dsn, DB_USER, DB_PASS, [
        PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
        PDO::ATTR_EMULATE_PREPARES   => false,
    ]);

    return $pdo;
}

// ── Shared CORS + JSON headers ────────────────────────────────
// Call set_headers() at the top of every endpoint
function set_headers(string $methods = "GET, POST"): void {
    header("Content-Type: application/json");
    header("Access-Control-Allow-Origin: "  . CORS_ORIGIN);
    header("Access-Control-Allow-Methods: " . $methods . ", OPTIONS");
    header("Access-Control-Allow-Headers: Content-Type");

    if ($_SERVER["REQUEST_METHOD"] === "OPTIONS") {
        http_response_code(204);
        exit;
    }
}

// ── JSON response helpers ─────────────────────────────────────
function ok(mixed $data): void {
    echo json_encode(["success" => true, "data" => $data]);
    exit;
}

function error(string $message, int $code = 400): void {
    http_response_code($code);
    echo json_encode(["success" => false, "error" => $message]);
    exit;
}

// ── Read + decode JSON body ───────────────────────────────────
function get_body(): array {
    $raw = file_get_contents("php://input");
    $body = json_decode($raw, true);
    if (!is_array($body)) error("Invalid or missing JSON body");
    return $body;
}