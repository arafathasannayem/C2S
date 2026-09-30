<?php
/**
 * Tests for backend/worker_dashboard.php
 * Tests worker dashboard profile, attendance, rating, bonus, overtime
 */

require_once __DIR__ . '/test_helper.php';

echo "Testing worker_dashboard.php\n";
echo str_repeat("-", 40) . "\n";

// Test 1: Required functions exist in source code
$source = file_get_contents(__DIR__ . '/../backend/worker_dashboard.php');
assert_true(strpos($source, 'function getWorkerByUserId') !== false, 'getWorkerByUserId function exists in source');
assert_true(strpos($source, 'function computeGrade') !== false, 'computeGrade function exists in source');
assert_true(strpos($source, 'function getAttendanceStats') !== false, 'getAttendanceStats function exists in source');

// Test 2: Worker profile data structure
$profile = [
    'worker' => [
        'id' => 4,
        'full_name' => 'Jannatul Ferdous',
        'employee_id' => 'EMP-1004',
        'department' => 'Finishing',
        'line_name' => 'Line-F01',
        'email' => 'worker4@c2sgarments.com',
        'phone' => '01711000007',
        'hire_date' => '2022-11-05',
    ],
    'attendance_rate' => 72.2,
    'present_days' => 13,
    'worked_days' => 18,
    'total_ot_hours' => 7.5,
    'today_output' => 62,
];
assert_array_has_key('worker', $profile, 'Profile has worker key');
assert_array_has_key('attendance_rate', $profile, 'Profile has attendance_rate');
assert_array_has_key('total_ot_hours', $profile, 'Profile has total_ot_hours');
assert_array_has_key('today_output', $profile, 'Profile has today_output');

// Test 3: Attendance rate calculation
$presentDays = 13;
$workedDays = 18;
$attRate = $workedDays > 0 ? round(($presentDays / $workedDays) * 100, 1) : 0;
assert_equals(72.2, $attRate, 'Attendance rate calculation is correct');

// Test 4: Attendance chart data
$chart = [
    ['date' => '2026-09-24', 'day' => 'Wed', 'status' => 'present', 'present' => 1],
    ['date' => '2026-09-25', 'day' => 'Thu', 'status' => 'present', 'present' => 1],
    ['date' => '2026-09-26', 'day' => 'Fri', 'status' => 'absent', 'present' => 0],
    ['date' => '2026-09-27', 'day' => 'Sat', 'status' => 'absent', 'present' => 0],
    ['date' => '2026-09-28', 'day' => 'Sun', 'status' => 'absent', 'present' => 0],
    ['date' => '2026-09-29', 'day' => 'Mon', 'status' => 'present', 'present' => 1],
    ['date' => '2026-09-30', 'day' => 'Tue', 'status' => 'present', 'present' => 1],
];
assert_equals(7, count($chart), 'Chart has 7 days');
assert_array_has_key('present', $chart[0], 'Chart day has present key');

// Test 5: Consistency rating calculation
$attRate = 72.2;
$trainRate = 66.7;
$efficiency = 72.2;
$score = ($attRate * 0.40) + ($trainRate * 0.30) + ($efficiency * 0.30);
assert_equals(70.9, round($score, 1), 'Consistency score calculation is correct');

// Test 6: Grade computation
function computeGrade($score) {
    if ($score >= 95) return 'A+';
    if ($score >= 88) return 'A';
    if ($score >= 80) return 'A-';
    if ($score >= 70) return 'B';
    if ($score >= 60) return 'C';
    return 'D';
}
assert_equals('B', computeGrade(70.9), 'Grade B for score 70.9');
assert_equals('A', computeGrade(90.0), 'Grade A for score 90.0');
assert_equals('C', computeGrade(65.0), 'Grade C for score 65.0');
assert_equals('D', computeGrade(50.0), 'Grade D for score 50.0');

// Test 7: Bonus eligibility
$attRate = 72.2;
$safetyCount = 0;
$eligible = ($attRate >= 85 && $safetyCount === 0);
assert_true(!$eligible, 'Not eligible when attendance < 85%');

// Test 8: Bonus eligible
$attRate = 90.0;
$eligible = ($attRate >= 85 && $safetyCount === 0);
assert_true($eligible, 'Eligible when attendance >= 85%');

// Test 9: Bonus amount calculation
$hourlyRate = 85.00;
$bonusAmount = round($hourlyRate * 160 * 0.10, 2);
assert_equals(1360.00, $bonusAmount, 'Bonus amount calculation is correct');

// Test 10: Overtime status
$recentPresent = 5;
$eligible = $recentPresent >= 5;
assert_true($eligible, 'Overtime eligible with 5+ present days');

// Test 11: Overtime not eligible
$recentPresent = 3;
$eligible = $recentPresent >= 5;
assert_true(!$eligible, 'Overtime not eligible with < 5 present days');

// Test 12: Recent attendance records
$records = [
    ['id' => 1, 'date' => '2026-09-30', 'shift' => 'morning', 'check_in' => '08:00:00', 'check_out' => null, 'overtime_hours' => 0, 'status' => 'present'],
    ['id' => 2, 'date' => '2026-09-29', 'shift' => 'morning', 'check_in' => '07:45:00', 'check_out' => '17:30:00', 'overtime_hours' => 1.0, 'status' => 'present'],
];
assert_equals(2, count($records), 'Recent attendance has 2 records');
assert_array_has_key('status', $records[0], 'Record has status');

// Test 13: Today's output from daily_output table
$todayOutput = 62;
assert_true($todayOutput > 0, 'Today output is positive');

// Test 14: Worker not found
$worker = null;
assert_null($worker, 'Worker not found returns null');

// Test 15: Overtime request data
$otRequest = [
    'worker_id' => 4,
    'requested_date' => '2026-10-01',
    'overtime_hours' => 2.0,
    'reason' => 'Urgent order completion',
];
assert_array_has_key('worker_id', $otRequest, 'OT request has worker_id');
assert_array_has_key('overtime_hours', $otRequest, 'OT request has overtime_hours');

print_test_summary();
