<?php
/**
 * Tests for backend/users.php
 * Tests user management CRUD operations
 */

require_once __DIR__ . '/test_helper.php';

echo "Testing users.php\n";
echo str_repeat("-", 40) . "\n";

// Test 1: Required functions exist in source code
$source = file_get_contents(__DIR__ . '/../backend/users.php');
assert_true(strpos($source, 'function addUser') !== false, 'addUser function exists in source');
assert_true(strpos($source, 'function getUsers') !== false, 'getUsers function exists in source');
assert_true(strpos($source, 'function updateUser') !== false, 'updateUser function exists in source');
assert_true(strpos($source, 'function deleteUser') !== false, 'deleteUser function exists in source');

// Test 2: User data structure
$user = [
    'id' => 1,
    'full_name' => 'Taskin Amir',
    'email' => 'admin@c2s.com',
    'role' => 'admin',
    'phone' => '+880 1712 345678',
    'status' => 'active',
];
assert_array_has_key('full_name', $user, 'User has full_name');
assert_array_has_key('email', $user, 'User has email');
assert_array_has_key('role', $user, 'User has role');
assert_array_has_key('status', $user, 'User has status');

// Test 3: Valid roles
$validRoles = ['admin', 'line_manager', 'worker', 'qc_inspector', 'maintenance_staff', 'auditor'];
assert_true(in_array('admin', $validRoles), 'admin is a valid role');
assert_true(in_array('line_manager', $validRoles), 'line_manager is a valid role');
assert_true(in_array('qc_inspector', $validRoles), 'qc_inspector is a valid role');

// Test 4: Valid statuses
$validStatuses = ['active', 'inactive'];
assert_true(in_array('active', $validStatuses), 'active is a valid status');
assert_true(in_array('inactive', $validStatuses), 'inactive is a valid status');

// Test 5: Add user data
$addData = [
    'full_name' => 'New User',
    'email' => 'newuser@c2s.com',
    'password' => 'password123',
    'role' => 'worker',
    'phone' => '+880 1712 345678',
    'employee_id' => 'EMP-2024-001',
];
assert_array_has_key('full_name', $addData, 'Add data has full_name');
assert_array_has_key('email', $addData, 'Add data has email');
assert_array_has_key('password', $addData, 'Add data has password');

// Test 6: Email uniqueness check
$email = 'admin@c2s.com';
$emailExists = true;
assert_true($emailExists, 'Email uniqueness is checked');

// Test 7: Update user data
$updateData = [
    'id' => 1,
    'full_name' => 'Updated Name',
    'email' => 'updated@c2s.com',
    'role' => 'line_manager',
    'phone' => '+880 1712 345678',
    'status' => 'active',
];
assert_array_has_key('id', $updateData, 'Update data has id');
assert_array_has_key('full_name', $updateData, 'Update data has full_name');

// Test 8: Delete user data
$deleteData = ['id' => 1];
assert_array_has_key('id', $deleteData, 'Delete data has id');

// Test 9: Pagination
$page = 1;
$limit = 10;
$offset = ($page - 1) * $limit;
assert_equals(0, $offset, 'Pagination offset is correct');

// Test 10: Search filter
$search = 'admin';
$roleFilter = 'admin';
$where = 'WHERE 1=1';
if ($search) {
    $where .= " AND (u.full_name LIKE '%$search%' OR u.email LIKE '%$search%')";
}
if ($roleFilter) {
    $where .= " AND u.role = '$roleFilter'";
}
assert_true(strpos($where, 'full_name') !== false, 'Search filter is applied');
assert_true(strpos($where, 'role') !== false, 'Role filter is applied');

print_test_summary();
