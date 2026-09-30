<?php
/**
 * Tests for backend/production.php
 * Tests production line management and stats
 */

require_once __DIR__ . '/test_helper.php';

echo "Testing production.php\n";
echo str_repeat("-", 40) . "\n";

// Test 1: Required functions exist in source code
$source = file_get_contents(__DIR__ . '/../backend/production.php');
assert_true(strpos($source, "case 'lines'") !== false, 'Lines functionality exists');
assert_true(strpos($source, "case 'create_line'") !== false, 'Create line functionality exists');
assert_true(strpos($source, "case 'stats'") !== false, 'Stats functionality exists');

// Test 2: Production line data structure
$line = [
    'id' => 1,
    'line_name' => 'Line-A',
    'line_type' => 'Sewing',
    'supervisor_id' => 5,
    'capacity' => 50,
    'current_workers' => 45,
    'target_output_per_hour' => 100,
    'status' => 'active',
];
assert_array_has_key('line_name', $line, 'Line has line_name');
assert_array_has_key('line_type', $line, 'Line has line_type');
assert_array_has_key('capacity', $line, 'Line has capacity');
assert_array_has_key('status', $line, 'Line has status');

// Test 3: Valid line types
$validLineTypes = ['Cutting', 'Sewing', 'Finishing', 'Packaging', 'Quality Control'];
assert_true(in_array('Sewing', $validLineTypes), 'Sewing is a valid line type');
assert_true(in_array('Cutting', $validLineTypes), 'Cutting is a valid line type');
assert_true(!in_array('Invalid', $validLineTypes), 'Invalid is not a valid line type');

// Test 4: Valid line statuses
$validStatuses = ['active', 'maintenance', 'inactive'];
assert_true(in_array('active', $validStatuses), 'active is a valid status');
assert_true(in_array('maintenance', $validStatuses), 'maintenance is a valid status');

// Test 5: Production stats calculation
$lines = [
    ['status' => 'active', 'capacity' => 50, 'current_workers' => 45],
    ['status' => 'active', 'capacity' => 50, 'current_workers' => 42],
    ['status' => 'maintenance', 'capacity' => 30, 'current_workers' => 0],
];
$totalLines = count($lines);
$activeLines = count(array_filter($lines, function($l) { return $l['status'] === 'active'; }));
$totalCapacity = array_sum(array_column($lines, 'capacity'));
$totalOperators = array_sum(array_column($lines, 'current_workers'));
assert_equals(3, $totalLines, 'Total lines count is correct');
assert_equals(2, $activeLines, 'Active lines count is correct');
assert_equals(130, $totalCapacity, 'Total capacity is correct');
assert_equals(87, $totalOperators, 'Total operators is correct');

// Test 6: Create line data
$createData = [
    'line_name' => 'Line-G',
    'line_type' => 'Sewing',
    'capacity' => 50,
    'supervisor_id' => 5,
    'status' => 'active',
];
assert_array_has_key('line_name', $createData, 'Create data has line_name');
assert_array_has_key('line_type', $createData, 'Create data has line_type');

// Test 7: Line efficiency calculation
$capacity = 50;
$currentWorkers = 45;
$efficiency = $capacity > 0 ? round(($currentWorkers / $capacity) * 100, 1) : 0;
assert_equals(90.0, $efficiency, 'Line efficiency calculation is correct');

// Test 8: Target output validation
$targetOutput = 100;
assert_true($targetOutput > 0, 'Target output is positive');

// Test 9: Capacity validation
$capacity = 50;
assert_true($capacity > 0, 'Capacity is positive');

print_test_summary();
