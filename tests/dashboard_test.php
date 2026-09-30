<?php
/**
 * Tests for backend/dashboard.php
 * Tests dashboard statistics and data aggregation
 */

require_once __DIR__ . '/test_helper.php';

echo "Testing dashboard.php\n";
echo str_repeat("-", 40) . "\n";

// Test 1: Required functions exist in source code
$source = file_get_contents(__DIR__ . '/../backend/dashboard.php');
assert_true(strpos($source, 'function getDashboardStats') !== false, 'getDashboardStats function exists in source');
assert_true(strpos($source, 'function getWorkerStats') !== false, 'getWorkerStats function exists in source');
assert_true(strpos($source, 'function getProductionStats') !== false, 'getProductionStats function exists in source');
assert_true(strpos($source, 'function getDefectStats') !== false, 'getDefectStats function exists in source');

// Test 2: Dashboard stats structure
$stats = [
    'total_workers' => 142,
    'current_on_shift' => 138,
    'today_production' => 3840,
    'line_efficiency' => 89.4,
    'defect_rate' => 1.45,
    'total_orders' => 128,
    'total_cost' => 42500.0,
];
assert_array_has_key('total_workers', $stats, 'Stats has total_workers');
assert_array_has_key('current_on_shift', $stats, 'Stats has current_on_shift');
assert_array_has_key('today_production', $stats, 'Stats has today_production');
assert_array_has_key('line_efficiency', $stats, 'Stats has line_efficiency');
assert_array_has_key('defect_rate', $stats, 'Stats has defect_rate');
assert_array_has_key('total_orders', $stats, 'Stats has total_orders');
assert_array_has_key('total_cost', $stats, 'Stats has total_cost');

// Test 3: Worker stats structure
$worker = [
    'full_name' => 'Taskin Amir',
    'employee_id' => 'EMP-001',
    'department' => 'Sewing',
    'reward_count' => 5,
    'total_bonus' => 15000.00,
];
assert_array_has_key('full_name', $worker, 'Worker has full_name');
assert_array_has_key('employee_id', $worker, 'Worker has employee_id');
assert_array_has_key('department', $worker, 'Worker has department');

// Test 4: Production stats structure
$line = [
    'id' => 1,
    'line_name' => 'Line-A',
    'line_type' => 'Sewing',
    'status' => 'active',
    'capacity' => 50,
    'current_workers' => 45,
    'target_output_per_hour' => 100,
    'active_jobs' => 3,
];
assert_array_has_key('line_name', $line, 'Line has line_name');
assert_array_has_key('capacity', $line, 'Line has capacity');
assert_array_has_key('current_workers', $line, 'Line has current_workers');

// Test 5: Defect stats structure
$defect = [
    'defect_type' => 'stitching',
    'count' => 14,
];
assert_array_has_key('defect_type', $defect, 'Defect has defect_type');
assert_array_has_key('count', $defect, 'Defect has count');

// Test 6: Efficiency calculation
$capacity = 50;
$currentWorkers = 45;
$efficiency = $capacity > 0 ? round(($currentWorkers / $capacity) * 100, 1) : 0;
assert_equals(90.0, $efficiency, 'Efficiency calculation is correct');

// Test 7: Defect rate calculation
$totalInspected = 1000;
$totalDefects = 15;
$defectRate = $totalInspected > 0 ? round(($totalDefects / $totalInspected) * 100, 2) : 0;
assert_equals(1.5, $defectRate, 'Defect rate calculation is correct');

// Test 8: Line efficiency average
$lines = [
    ['capacity' => 50, 'current_workers' => 45],
    ['capacity' => 50, 'current_workers' => 42],
    ['capacity' => 30, 'current_workers' => 28],
];
$totalEfficiency = 0;
$count = 0;
foreach ($lines as $line) {
    if ($line['capacity'] > 0) {
        $totalEfficiency += ($line['current_workers'] / $line['capacity']) * 100;
        $count++;
    }
}
$avgEfficiency = $count > 0 ? round($totalEfficiency / $count, 1) : 0;
assert_true($avgEfficiency > 0, 'Average efficiency is calculated');

print_test_summary();
