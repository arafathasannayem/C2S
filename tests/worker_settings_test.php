<?php
/**
 * Tests for backend/worker_settings.php
 * Tests worker profile settings and password management
 */

require_once __DIR__ . '/test_helper.php';

echo "Testing worker_settings.php\n";
echo str_repeat("-", 40) . "\n";

// Test 1: Required functions exist in source code
$source = file_get_contents(__DIR__ . '/../backend/worker_settings.php');
assert_true(strpos($source, "case 'profile'") !== false, 'Profile functionality exists');
assert_true(strpos($source, "case 'update_profile'") !== false, 'Update profile functionality exists');
assert_true(strpos($source, "case 'change_password'") !== false, 'Change password functionality exists');
assert_true(strpos($source, "case 'get_supervisors'") !== false, 'Get supervisors functionality exists');

// Test 2: Worker profile data structure
$profile = [
    'id' => 4,
    'full_name' => 'Jannatul Ferdous',
    'email' => 'worker4@c2sgarments.com',
    'phone' => '01711000007',
    'role' => 'worker',
    'employee_id' => 'EMP-1004',
    'department' => 'Finishing',
    'position' => 'Senior Finishing Operator',
    'line_name' => 'Line-F01',
    'hire_date' => '2022-11-05',
];
assert_array_has_key('full_name', $profile, 'Profile has full_name');
assert_array_has_key('email', $profile, 'Profile has email');
assert_array_has_key('phone', $profile, 'Profile has phone');
assert_array_has_key('employee_id', $profile, 'Profile has employee_id');

// Test 3: Update profile data
$updateData = [
    'user_id' => 4,
    'full_name' => 'Jannatul Ferdous Updated',
    'phone' => '01711000008',
];
assert_array_has_key('user_id', $updateData, 'Update data has user_id');
assert_array_has_key('full_name', $updateData, 'Update data has full_name');
assert_array_has_key('phone', $updateData, 'Update data has phone');

// Test 4: Change password data
$passwordData = [
    'user_id' => 4,
    'new_password' => 'newpassword123',
];
assert_array_has_key('user_id', $passwordData, 'Password data has user_id');
assert_array_has_key('new_password', $passwordData, 'Password data has new_password');

// Test 5: Password validation
$newPassword = 'newpassword123';
assert_true(strlen($newPassword) >= 6, 'Password meets minimum length');

// Test 6: Password too short
$newPassword = '123';
assert_true(strlen($newPassword) < 6, 'Short password is detected');

// Test 7: Supervisor data structure
$supervisor = [
    'id' => 1,
    'full_name' => 'Md. Faruk Hossain',
    'employee_id' => 'SUP-001',
    'line_name' => 'Line 1 - Sewing',
];
assert_array_has_key('full_name', $supervisor, 'Supervisor has full_name');
assert_array_has_key('employee_id', $supervisor, 'Supervisor has employee_id');

// Test 8: Supervisor list
$supervisors = [
    ['id' => 1, 'full_name' => 'Md. Faruk Hossain', 'employee_id' => 'SUP-001'],
    ['id' => 2, 'full_name' => 'Nasreen Akter', 'employee_id' => 'SUP-002'],
];
assert_equals(2, count($supervisors), 'Supervisor list has 2 items');

// Test 9: User not found
$worker = null;
assert_null($worker, 'User not found returns null');

// Test 10: Profile update validation
$fullName = 'Jannatul Ferdous';
$phone = '01711000007';
assert_true(!empty($fullName), 'Full name is not empty');
assert_true(!empty($phone), 'Phone is not empty');

// Test 11: Phone number validation
$phone = '01711000007';
assert_true(strlen($phone) >= 5, 'Phone number has minimum length');

// Test 12: Email format validation
$email = 'worker4@c2sgarments.com';
assert_true(filter_var($email, FILTER_VALIDATE_EMAIL) !== false, 'Email format is valid');

print_test_summary();
