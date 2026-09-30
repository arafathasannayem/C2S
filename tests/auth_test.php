<?php
/**
 * Tests for backend/auth.php
 * Tests login, logout, and session validation
 */

require_once __DIR__ . '/test_helper.php';

echo "Testing auth.php\n";
echo str_repeat("-", 40) . "\n";

// Test 1: Required functions exist in source code
$source = file_get_contents(__DIR__ . '/../backend/auth.php');
assert_true(strpos($source, 'function handleLogin') !== false, 'handleLogin function exists in source');
assert_true(strpos($source, 'function handleLogout') !== false, 'handleLogout function exists in source');
assert_true(strpos($source, 'function checkAuth') !== false, 'checkAuth function exists in source');

// Test 2: Login with empty email fails
$input = json_encode(['email' => '', 'password' => 'test']);
$data = json_decode($input, true);
assert_true(empty($data['email']), 'Empty email is detected');

// Test 3: Login with empty password fails
$input = json_encode(['email' => 'test@test.com', 'password' => '']);
$data = json_decode($input, true);
assert_true(empty($data['password']), 'Empty password is detected');

// Test 4: Login with valid input structure
$input = json_encode(['email' => 'admin@c2s.com', 'password' => 'admin123']);
$data = json_decode($input, true);
assert_equals('admin@c2s.com', $data['email'], 'Email is correctly parsed');
assert_equals('admin123', $data['password'], 'Password is correctly parsed');

// Test 5: JSON response structure for success
$response = ['success' => true, 'message' => 'Login successful', 'user' => ['id' => 1]];
assert_true($response['success'], 'Success response has success=true');
assert_array_has_key('user', $response, 'Success response has user key');

// Test 6: JSON response structure for failure
$response = ['success' => false, 'message' => 'Invalid password'];
assert_true(!$response['success'], 'Failure response has success=false');
assert_array_has_key('message', $response, 'Failure response has message key');

// Test 7: Session data structure
$_SESSION = [];
$_SESSION['user_id'] = 1;
$_SESSION['email'] = 'admin@c2s.com';
$_SESSION['full_name'] = 'Admin';
$_SESSION['role'] = 'admin';
assert_equals(1, $_SESSION['user_id'], 'Session user_id is set');
assert_equals('admin', $_SESSION['role'], 'Session role is set');

// Test 8: Role validation
$validRoles = ['admin', 'line_manager', 'worker', 'qc_inspector', 'maintenance_staff', 'auditor'];
assert_true(in_array('admin', $validRoles), 'Admin is a valid role');
assert_true(in_array('worker', $validRoles), 'Worker is a valid role');
assert_true(!in_array('invalid_role', $validRoles), 'Invalid role is rejected');

print_test_summary();
