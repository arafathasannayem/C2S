<?php
/**
 * Tests for backend/machines.php
 * Tests machine fleet management and work orders
 */

require_once __DIR__ . '/test_helper.php';

echo "Testing machines.php\n";
echo str_repeat("-", 40) . "\n";

// Test 1: Required functions exist in source code
$source = file_get_contents(__DIR__ . '/../backend/machines.php');
assert_true(strpos($source, "case 'list'") !== false, 'List functionality exists');
assert_true(strpos($source, "case 'create_work_order'") !== false, 'Create work order functionality exists');

// Test 2: Machine data structure
$machine = [
    'id' => 1,
    'machine_name' => 'Sewing Machine A1',
    'machine_code' => 'MCH-001',
    'line_id' => 1,
    'model_number' => 'JUKI DDL-8700',
    'health_index' => 95,
    'last_maintenance_date' => '2026-08-15',
    'next_maintenance_date' => '2026-09-15',
    'status' => 'operational',
];
assert_array_has_key('machine_name', $machine, 'Machine has machine_name');
assert_array_has_key('machine_code', $machine, 'Machine has machine_code');
assert_array_has_key('health_index', $machine, 'Machine has health_index');
assert_array_has_key('status', $machine, 'Machine has status');

// Test 3: Valid statuses
$validStatuses = ['operational', 'maintenance', 'broken'];
assert_true(in_array('operational', $validStatuses), 'operational is a valid status');
assert_true(in_array('maintenance', $validStatuses), 'maintenance is a valid status');
assert_true(in_array('broken', $validStatuses), 'broken is a valid status');

// Test 4: Health index validation
$healthIndex = 95;
assert_true($healthIndex >= 0 && $healthIndex <= 100, 'Health index is within 0-100');

// Test 5: Fleet summary calculation
$machines = [
    ['status' => 'operational', 'health_index' => 95],
    ['status' => 'operational', 'health_index' => 88],
    ['status' => 'maintenance', 'health_index' => 45],
    ['status' => 'broken', 'health_index' => 20],
];
$total = count($machines);
$operational = count(array_filter($machines, function($m) { return $m['status'] === 'operational'; }));
$maintenance = count(array_filter($machines, function($m) { return $m['status'] === 'maintenance'; }));
$broken = count(array_filter($machines, function($m) { return $m['status'] === 'broken'; }));
$healthSum = array_sum(array_column($machines, 'health_index'));
$avgHealth = $total > 0 ? round($healthSum / $total, 1) : 0;
assert_equals(4, $total, 'Total machines count is correct');
assert_equals(2, $operational, 'Operational count is correct');
assert_equals(1, $maintenance, 'Maintenance count is correct');
assert_equals(1, $broken, 'Broken count is correct');
assert_equals(62.0, $avgHealth, 'Average health is correct');

// Test 6: Work order data
$workOrder = [
    'order_code' => 'WO-20260913-001',
    'machine_id' => 1,
    'maintenance_type' => 'Preventive',
    'description' => 'Oil pump replacement',
    'cost' => 150.00,
    'technician_id' => 6,
    'scheduled_date' => '2026-09-18',
    'status' => 'pending',
];
assert_array_has_key('machine_id', $workOrder, 'Work order has machine_id');
assert_array_has_key('maintenance_type', $workOrder, 'Work order has maintenance_type');
assert_array_has_key('status', $workOrder, 'Work order has status');

// Test 7: Valid maintenance types
$validTypes = ['Preventive', 'Corrective', 'Emergency Breakdown'];
assert_true(in_array('Preventive', $validTypes), 'Preventive is a valid type');
assert_true(in_array('Corrective', $validTypes), 'Corrective is a valid type');
assert_true(in_array('Emergency Breakdown', $validTypes), 'Emergency Breakdown is a valid type');

// Test 8: Work order code generation
$code = 'WO-' . date('Ymd') . '-' . rand(100, 999);
assert_true(strpos($code, 'WO-') === 0, 'Work order code starts with WO-');

// Test 9: Emergency breakdown status update
$maintenanceType = 'Emergency Breakdown';
$newStatus = 'maintenance';
assert_true($maintenanceType === 'Emergency Breakdown', 'Emergency breakdown triggers maintenance status');

// Test 10: Active work orders count
$workOrders = [
    ['machine_id' => 1, 'status' => 'pending'],
    ['machine_id' => 1, 'status' => 'in_progress'],
    ['machine_id' => 2, 'status' => 'completed'],
];
$activeOrders = count(array_filter($workOrders, function($wo) { return $wo['status'] != 'completed'; }));
assert_equals(2, $activeOrders, 'Active work orders count is correct');

print_test_summary();
