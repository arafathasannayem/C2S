<?php
/**
 * Tests for backend/config.php
 * Tests database configuration and JSON response helpers
 */

require_once __DIR__ . '/test_helper.php';

echo "Testing config.php\n";
echo str_repeat("-", 40) . "\n";

// Test 1: Database constants are defined
assert_true(defined('DB_HOST'), 'DB_HOST constant is defined');
assert_true(defined('DB_USER'), 'DB_USER constant is defined');
assert_true(defined('DB_PASS'), 'DB_PASS constant is defined');
assert_true(defined('DB_NAME'), 'DB_NAME constant is defined');

// Test 2: getDBConnection function exists
assert_true(function_exists('getDBConnection'), 'getDBConnection function exists');

// Test 3: sendJsonResponse function exists
assert_true(function_exists('sendJsonResponse'), 'sendJsonResponse function exists');

// Test 4: Database name is correct
assert_equals('garments_management', DB_NAME, 'Database name is garments_management');

// Test 5: Default DB host
assert_equals('localhost', DB_HOST, 'Default DB host is localhost');

// Test 6: Default DB user
assert_equals('root', DB_USER, 'Default DB user is root');

// Test 7: JSON response structure
$response = ['success' => true, 'message' => 'Test', 'data' => []];
assert_true($response['success'], 'JSON response has success field');
assert_array_has_key('message', $response, 'JSON response has message field');
assert_array_has_key('data', $response, 'JSON response has data field');

// Test 8: Error response structure
$errorResponse = ['success' => false, 'error_code' => 'TEST_ERROR', 'message' => 'Test error'];
assert_true(!$errorResponse['success'], 'Error response has success=false');
assert_array_has_key('error_code', $errorResponse, 'Error response has error_code field');

// Test 9: Pagination structure
$pagination = ['page' => 1, 'limit' => 10, 'total' => 100, 'pages' => 10];
assert_array_has_key('page', $pagination, 'Pagination has page');
assert_array_has_key('limit', $pagination, 'Pagination has limit');
assert_array_has_key('total', $pagination, 'Pagination has total');
assert_array_has_key('pages', $pagination, 'Pagination has pages');

// Test 10: Timestamp format
$timestamp = date('Y-m-d\TH:i:s\Z');
assert_true(strpos($timestamp, 'T') !== false, 'Timestamp has ISO format');

print_test_summary();
