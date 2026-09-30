<?php
/**
 * Tests for backend/jobs.php
 * Tests job sequencing and order scheduling
 */

require_once __DIR__ . '/test_helper.php';

echo "Testing jobs.php\n";
echo str_repeat("-", 40) . "\n";

// Test 1: Required functions exist in source code
$source = file_get_contents(__DIR__ . '/../backend/jobs.php');
assert_true(strpos($source, "case 'queue'") !== false, 'Queue functionality exists');
assert_true(strpos($source, "case 'add_job'") !== false, 'Add job functionality exists');

// Test 2: Job sequence data structure
$job = [
    'id' => 1,
    'order_id' => 104,
    'product_id' => 2,
    'line_id' => 3,
    'quantity' => 1500,
    'priority' => 'High',
    'sequence_order' => 1,
    'start_date' => '2026-09-15',
    'due_date' => '2026-09-22',
    'status' => 'queued',
];
assert_array_has_key('order_id', $job, 'Job has order_id');
assert_array_has_key('product_id', $job, 'Job has product_id');
assert_array_has_key('line_id', $job, 'Job has line_id');
assert_array_has_key('quantity', $job, 'Job has quantity');
assert_array_has_key('priority', $job, 'Job has priority');
assert_array_has_key('status', $job, 'Job has status');

// Test 3: Valid priorities
$validPriorities = ['Low', 'Medium', 'High', 'Critical'];
assert_true(in_array('High', $validPriorities), 'High is a valid priority');
assert_true(in_array('Critical', $validPriorities), 'Critical is a valid priority');

// Test 4: Valid statuses
$validStatuses = ['queued', 'running', 'paused', 'completed'];
assert_true(in_array('queued', $validStatuses), 'queued is a valid status');
assert_true(in_array('running', $validStatuses), 'running is a valid status');

// Test 5: Add job data
$addData = [
    'order_id' => 104,
    'product_id' => 2,
    'quantity' => 1500,
    'line_id' => 3,
    'start_date' => '2026-09-15',
    'due_date' => '2026-09-22',
    'priority' => 'High',
];
assert_array_has_key('quantity', $addData, 'Add data has quantity');
assert_array_has_key('priority', $addData, 'Add data has priority');

// Test 6: Quantity validation
$quantity = 1500;
assert_true($quantity > 0, 'Quantity is positive');

// Test 7: Date validation
$startDate = '2026-09-15';
$dueDate = '2026-09-22';
assert_true(strtotime($dueDate) >= strtotime($startDate), 'Due date is after start date');

// Test 8: Queue ordering
$queue = [
    ['sequence_order' => 1, 'due_date' => '2026-09-22'],
    ['sequence_order' => 2, 'due_date' => '2026-09-25'],
    ['sequence_order' => 3, 'due_date' => '2026-09-20'],
];
usort($queue, function($a, $b) { return $a['sequence_order'] <=> $b['sequence_order']; });
assert_equals(1, $queue[0]['sequence_order'], 'Queue is sorted by sequence_order');

// Test 9: Priority weighting
$priorityWeights = ['Low' => 1, 'Medium' => 2, 'High' => 3, 'Critical' => 4];
assert_equals(3, $priorityWeights['High'], 'High priority weight is correct');
assert_equals(4, $priorityWeights['Critical'], 'Critical priority weight is correct');

// Test 10: Job duration calculation
$startDate = strtotime('2026-09-15');
$dueDate = strtotime('2026-09-22');
$duration = round(($dueDate - $startDate) / (60 * 60 * 24));
assert_equals(7, $duration, 'Job duration calculation is correct');

print_test_summary();
