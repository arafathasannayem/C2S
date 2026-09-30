<?php
/**
 * C2S Backend Test Helper
 * Shared utilities for all test files
 */

if (!defined('TEST_MODE')) {
    define('TEST_MODE', true);
}

// Bootstrap backend constants if not already loaded
if (!defined('DB_HOST')) {
    define('DB_HOST', 'localhost');
    define('DB_USER', 'root');
    define('DB_PASS', '');
    define('DB_NAME', 'garments_management');
}

// Mock session for testing
if (session_status() === PHP_SESSION_NONE) {
    @session_start();
}

// Test result tracking
$testResults = [
    'passed' => 0,
    'failed' => 0,
    'errors' => [],
];

/**
 * Assert that a condition is true
 */
function assert_true($condition, $message = '') {
    global $testResults;
    if ($condition) {
        $testResults['passed']++;
        echo "  [PASS] {$message}\n";
    } else {
        $testResults['failed']++;
        $testResults['errors'][] = $message;
        echo "  [FAIL] {$message}\n";
    }
}

/**
 * Assert that two values are equal
 */
function assert_equals($expected, $actual, $message = '') {
    global $testResults;
    if ($expected === $actual) {
        $testResults['passed']++;
        echo "  [PASS] {$message}\n";
    } else {
        $testResults['failed']++;
        $msg = $message ?: "Expected " . var_export($expected, true) . " but got " . var_export($actual, true);
        $testResults['errors'][] = $msg;
        echo "  [FAIL] {$msg}\n";
    }
}

/**
 * Assert that a value is not null
 */
function assert_not_null($value, $message = '') {
    global $testResults;
    if ($value !== null) {
        $testResults['passed']++;
        echo "  [PASS] {$message}\n";
    } else {
        $testResults['failed']++;
        $testResults['errors'][] = $message ?: "Expected non-null value";
        echo "  [FAIL] {$message}\n";
    }
}

/**
 * Assert that a value is null
 */
function assert_null($value, $message = '') {
    global $testResults;
    if ($value === null) {
        $testResults['passed']++;
        echo "  [PASS] {$message}\n";
    } else {
        $testResults['failed']++;
        $testResults['errors'][] = $message ?: "Expected null value";
        echo "  [FAIL] {$message}\n";
    }
}

/**
 * Assert that a value is greater than another
 */
function assert_greater_than($expected, $actual, $message = '') {
    global $testResults;
    if ($actual > $expected) {
        $testResults['passed']++;
        echo "  [PASS] {$message}\n";
    } else {
        $testResults['failed']++;
        $testResults['errors'][] = $message ?: "Expected {$actual} > {$expected}";
        echo "  [FAIL] {$message}\n";
    }
}

/**
 * Assert that an array has a key
 */
function assert_array_has_key($key, $array, $message = '') {
    global $testResults;
    if (array_key_exists($key, $array)) {
        $testResults['passed']++;
        echo "  [PASS] {$message}\n";
    } else {
        $testResults['failed']++;
        $testResults['errors'][] = $message ?: "Array missing key: {$key}";
        echo "  [FAIL] {$message}\n";
    }
}

/**
 * Assert that a string contains a substring
 */
function assert_contains($needle, $haystack, $message = '') {
    global $testResults;
    if (strpos($haystack, $needle) !== false) {
        $testResults['passed']++;
        echo "  [PASS] {$message}\n";
    } else {
        $testResults['failed']++;
        $testResults['errors'][] = $message ?: "'{$haystack}' does not contain '{$needle}'";
        echo "  [FAIL] {$message}\n";
    }
}

/**
 * Print test summary
 */
function print_test_summary() {
    global $testResults;
    echo "\n" . str_repeat("=", 60) . "\n";
    echo "TEST SUMMARY\n";
    echo str_repeat("=", 60) . "\n";
    echo "Passed: {$testResults['passed']}\n";
    echo "Failed: {$testResults['failed']}\n";
    echo "Total:  " . ($testResults['passed'] + $testResults['failed']) . "\n";
    if ($testResults['failed'] > 0) {
        echo "\nFailed tests:\n";
        foreach ($testResults['errors'] as $error) {
            echo "  - {$error}\n";
        }
    }
    echo str_repeat("=", 60) . "\n";
}

/**
 * Mock database connection for testing
 */
function getMockDBConnection() {
    return new class {
        public $connect_error = null;
        public $insert_id = 1;
        public $affected_rows = 1;
        public $error = '';

        public function set_charset($charset) { return true; }
        public function prepare($sql) { return new MockStatement($sql); }
        public function query($sql) { return new MockResult(); }
        public function real_escape_string($str) { return $str; }
        public function close() {}
    };
}

class MockStatement {
    private $sql;
    public $insert_id = 1;

    public function __construct($sql) { $this->sql = $sql; }
    public function bind_param($types, ...$params) { return true; }
    public function execute() { return true; }
    public function get_result() { return new MockResult(); }
    public function close() {}
}

class MockResult {
    public $num_rows = 0;

    public function fetch_assoc() { return null; }
    public function fetch_all() { return []; }
}

/**
 * Simulate a GET request to a backend endpoint
 */
function simulateGetRequest($url, $params = []) {
    $_GET = array_merge(['action' => ''], $params);
    $_SERVER['REQUEST_METHOD'] = 'GET';
    return $url;
}

/**
 * Simulate a POST request to a backend endpoint
 */
function simulatePostRequest($url, $data = []) {
    $_GET = ['action' => ''];
    $_POST = $data;
    $_SERVER['REQUEST_METHOD'] = 'POST';
    $GLOBALS['HTTP_RAW_POST_DATA'] = json_encode($data);
    return $url;
}
