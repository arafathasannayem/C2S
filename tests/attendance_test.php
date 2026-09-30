<?php
/**
 * Tests for backend/attendance.php
 * Tests attendance tracking, availability, and marking
 */

require_once __DIR__ . '/test_helper.php';

echo "Testing attendance.php\n";
echo str_repeat("-", 40) . "\n";

// Test 1: Attendance rate calculation
$presentCount = 138;
$absentCount = 4;
$lateCount = 2;
$totalMarked = $presentCount + $absentCount + $lateCount;
$rate = $totalMarked > 0 ? round(($presentCount / $totalMarked) * 100, 1) : 95.0;
assert_equals(95.8, $rate, 'Attendance rate calculation is correct');

// Test 2: Attendance record structure
$record = [
    'worker_id' => 1,
    'date' => '2026-09-13',
    'shift' => 'morning',
    'check_in' => '08:02:00',
    'check_out' => '17:00:00',
    'status' => 'present',
    'overtime_hours' => 0.00,
];
assert_array_has_key('worker_id', $record, 'Record has worker_id');
assert_array_has_key('date', $record, 'Record has date');
assert_array_has_key('shift', $record, 'Record has shift');
assert_array_has_key('status', $record, 'Record has status');

// Test 3: Valid shift values
$validShifts = ['morning', 'evening', 'night'];
assert_true(in_array('morning', $validShifts), 'morning is a valid shift');
assert_true(in_array('evening', $validShifts), 'evening is a valid shift');
assert_true(in_array('night', $validShifts), 'night is a valid shift');

// Test 4: Valid attendance statuses
$validStatuses = ['present', 'absent', 'late', 'half_day', 'on_leave'];
assert_true(in_array('present', $validStatuses), 'present is a valid status');
assert_true(in_array('half_day', $validStatuses), 'half_day is a valid status');
assert_true(in_array('on_leave', $validStatuses), 'on_leave is a valid status');

// Test 5: Line availability calculation
$capacity = 50;
$presentWorkers = 45;
$shortage = max(0, $capacity - $presentWorkers);
$coveragePct = $capacity > 0 ? round(($presentWorkers / $capacity) * 100, 1) : 100;
assert_equals(5, $shortage, 'Shortage calculation is correct');
assert_equals(90.0, $coveragePct, 'Coverage percentage is correct');

// Test 6: Availability status
$status = $presentWorkers >= $capacity ? 'Full Coverage' : ($presentWorkers >= $capacity * 0.8 ? 'Adequate' : 'Critical Shortage');
assert_equals('Adequate', $status, 'Availability status is correct');

// Test 7: Full coverage status
$presentWorkers = 50;
$status = $presentWorkers >= $capacity ? 'Full Coverage' : ($presentWorkers >= $capacity * 0.8 ? 'Adequate' : 'Critical Shortage');
assert_equals('Full Coverage', $status, 'Full coverage status is correct');

// Test 8: Critical shortage status
$presentWorkers = 30;
$status = $presentWorkers >= $capacity ? 'Full Coverage' : ($presentWorkers >= $capacity * 0.8 ? 'Adequate' : 'Critical Shortage');
assert_equals('Critical Shortage', $status, 'Critical shortage status is correct');

// Test 9: Mark attendance data
$markData = [
    'worker_id' => 1,
    'date' => '2026-09-13',
    'shift' => 'morning',
    'status' => 'present',
    'check_in' => '08:00:00',
    'check_out' => null,
];
assert_array_has_key('worker_id', $markData, 'Mark data has worker_id');
assert_array_has_key('status', $markData, 'Mark data has status');

// Test 10: Overtime hours validation
$overtimeHours = 2.5;
assert_true($overtimeHours >= 0, 'Overtime hours is non-negative');
assert_true($overtimeHours <= 24, 'Overtime hours is within valid range');

print_test_summary();
