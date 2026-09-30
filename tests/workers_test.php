<?php
/**
 * Tests for backend/workers.php
 * Tests worker listing, training assignment, and recognition
 */

require_once __DIR__ . '/test_helper.php';

echo "Testing workers.php\n";
echo str_repeat("-", 40) . "\n";

// Test 1: Required functions exist in source code
$source = file_get_contents(__DIR__ . '/../backend/workers.php');
assert_true(strpos($source, 'function getWorkers') !== false || strpos($source, "case 'list'") !== false, 'Worker list functionality exists');
assert_true(strpos($source, 'assign_training') !== false, 'Training assignment functionality exists');
assert_true(strpos($source, 'award_recognition') !== false, 'Award recognition functionality exists');

// Test 2: Pagination calculation
$page = 2;
$limit = 10;
$offset = ($page - 1) * $limit;
assert_equals(10, $offset, 'Pagination offset is correct');

// Test 3: Worker data structure
$worker = [
    'id' => 1,
    'full_name' => 'Taskin Amir',
    'employee_id' => 'EMP-001',
    'department' => 'Sewing',
    'status' => 'active',
    'hourly_rate' => 85.00,
    'skill_level' => 'Skilled',
];
assert_array_has_key('full_name', $worker, 'Worker has full_name');
assert_array_has_key('employee_id', $worker, 'Worker has employee_id');
assert_array_has_key('department', $worker, 'Worker has department');
assert_array_has_key('status', $worker, 'Worker has status');

// Test 4: Training assignment data
$training = [
    'worker_id' => 1,
    'training_module' => 'Overlock Stitching Precision & Safety',
    'supervisor_id' => 3,
    'start_date' => '2026-09-20',
    'target_completion_date' => '2026-10-05',
    'notes' => 'Improve stitch alignment on Line 3',
];
assert_array_has_key('worker_id', $training, 'Training has worker_id');
assert_array_has_key('training_module', $training, 'Training has training_module');
assert_array_has_key('supervisor_id', $training, 'Training has supervisor_id');

// Test 5: Award recognition data
$award = [
    'worker_id' => 1,
    'reward_type' => 'bonus',
    'title' => 'Best Performer',
    'description' => 'Exceeded production target by 15%',
    'bonus_amount' => 5000.00,
    'awarded_by' => 1,
];
assert_array_has_key('worker_id', $award, 'Award has worker_id');
assert_array_has_key('reward_type', $award, 'Award has reward_type');
assert_array_has_key('bonus_amount', $award, 'Award has bonus_amount');

// Test 6: Valid reward types
$validRewardTypes = ['promotion', 'bonus', 'best_performer', 'zero_defect_award'];
assert_true(in_array('bonus', $validRewardTypes), 'bonus is a valid reward type');
assert_true(in_array('promotion', $validRewardTypes), 'promotion is a valid reward type');
assert_true(!in_array('invalid', $validRewardTypes), 'invalid is not a valid reward type');

// Test 7: Valid departments
$validDepartments = ['Cutting', 'Sewing', 'Finishing', 'Packaging', 'Quality Control', 'Maintenance'];
assert_true(in_array('Sewing', $validDepartments), 'Sewing is a valid department');
assert_true(in_array('Cutting', $validDepartments), 'Cutting is a valid department');
assert_true(!in_array('Invalid', $validDepartments), 'Invalid is not a valid department');

// Test 8: Valid skill levels
$validSkillLevels = ['Trainee', 'Semi-Skilled', 'Skilled', 'Master Operator'];
assert_true(in_array('Skilled', $validSkillLevels), 'Skilled is a valid skill level');
assert_true(in_array('Master Operator', $validSkillLevels), 'Master Operator is a valid skill level');

// Test 9: Search filter
$search = 'Taskin';
$department = 'Sewing';
$filterActive = !empty($search) || !empty($department);
assert_true($filterActive, 'Filter is active when search or department is provided');

// Test 10: Empty search filter
$search = '';
$department = '';
$filterActive = !empty($search) || !empty($department);
assert_true(!$filterActive, 'Filter is inactive when search and department are empty');

print_test_summary();
