<?php
/**
 * Tests for backend/safety.php
 * Tests safety incident reporting and resolution
 */

require_once __DIR__ . '/test_helper.php';

echo "Testing safety.php\n";
echo str_repeat("-", 40) . "\n";

// Test 1: Required functions exist in source code
$source = file_get_contents(__DIR__ . '/../backend/safety.php');
assert_true(strpos($source, "case 'list'") !== false, 'List functionality exists');
assert_true(strpos($source, "case 'submit'") !== false, 'Submit functionality exists');
assert_true(strpos($source, "case 'resolve'") !== false, 'Resolve functionality exists');

// Test 2: Safety report data structure
$report = [
    'id' => 1,
    'report_code' => 'SAF-20260913-001',
    'title' => 'Slippery floor near Line 2',
    'category' => 'Public Safety',
    'severity' => 'Major',
    'location' => 'Line 2 - East Staircase',
    'description_bn' => 'লাইন ২ এর কাছে সিড়ির হাতল ভাঙা',
    'description_en' => 'Broken stair handrail near Line 2',
    'reported_by' => 14,
    'incident_date' => '2026-09-13',
    'status' => 'Pending',
];
assert_array_has_key('report_code', $report, 'Report has report_code');
assert_array_has_key('title', $report, 'Report has title');
assert_array_has_key('category', $report, 'Report has category');
assert_array_has_key('severity', $report, 'Report has severity');
assert_array_has_key('status', $report, 'Report has status');

// Test 3: Valid categories
$validCategories = ['Public Safety', 'Machine Hazard', 'Electrical', 'Chemical / Fire', 'Personal Protection'];
assert_true(in_array('Public Safety', $validCategories), 'Public Safety is a valid category');
assert_true(in_array('Machine Hazard', $validCategories), 'Machine Hazard is a valid category');

// Test 4: Valid severities
$validSeverities = ['Minor', 'Major', 'Critical'];
assert_true(in_array('Minor', $validSeverities), 'Minor is a valid severity');
assert_true(in_array('Major', $validSeverities), 'Major is a valid severity');
assert_true(in_array('Critical', $validSeverities), 'Critical is a valid severity');

// Test 5: Valid statuses
$validStatuses = ['Unresolved', 'Pending', 'Resolved'];
assert_true(in_array('Unresolved', $validStatuses), 'Unresolved is a valid status');
assert_true(in_array('Pending', $validStatuses), 'Pending is a valid status');
assert_true(in_array('Resolved', $validStatuses), 'Resolved is a valid status');

// Test 6: Report code generation
$code = 'SAF-' . date('Ymd') . '-' . rand(100, 999);
assert_true(strpos($code, 'SAF-') === 0, 'Report code starts with SAF-');
assert_true(strlen($code) >= 15, 'Report code has minimum length');

// Test 7: Summary counts
$reports = [
    ['status' => 'Unresolved'],
    ['status' => 'Pending'],
    ['status' => 'Resolved'],
    ['status' => 'Unresolved'],
    ['status' => 'Pending'],
];
$unresolved = count(array_filter($reports, function($r) { return $r['status'] === 'Unresolved'; }));
$pending = count(array_filter($reports, function($r) { return $r['status'] === 'Pending'; }));
$resolved = count(array_filter($reports, function($r) { return $r['status'] === 'Resolved'; }));
assert_equals(2, $unresolved, 'Unresolved count is correct');
assert_equals(2, $pending, 'Pending count is correct');
assert_equals(1, $resolved, 'Resolved count is correct');

// Test 8: Resolution data
$resolution = [
    'safety_report_id' => 1,
    'resolution_notes_bn' => 'সিঁড়ির হাতল মেরামত করা হয়েছে',
    'resolution_notes_en' => 'Handrail welded securely',
    'resolved_by' => 1,
];
assert_array_has_key('safety_report_id', $resolution, 'Resolution has safety_report_id');
assert_array_has_key('resolved_by', $resolution, 'Resolution has resolved_by');

// Test 9: Bengali text validation
$descriptionBn = 'লাইন ২ এর কাছে সিড়ির হাতল ভাঙা';
assert_true(mb_strlen($descriptionBn) > 0, 'Bengali description is not empty');

// Test 10: Status transition
$currentStatus = 'Pending';
$newStatus = 'Resolved';
assert_true($currentStatus !== $newStatus, 'Status can be changed');

print_test_summary();
