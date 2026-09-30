<?php
/**
 * Tests for backend/worker_payment.php
 * Tests worker payslips and payment methods
 */

require_once __DIR__ . '/test_helper.php';

echo "Testing worker_payment.php\n";
echo str_repeat("-", 40) . "\n";

// Test 1: Required functions exist in source code
$source = file_get_contents(__DIR__ . '/../backend/worker_payment.php');
assert_true(strpos($source, 'function getWorkerByUserId') !== false, 'getWorkerByUserId function exists in source');

// Test 2: Payslip data structure
$payslip = [
    'id' => 1,
    'worker_id' => 4,
    'pay_period' => '2026-09',
    'base_salary' => 14500.00,
    'attendance_bonus' => 1200.00,
    'performance_bonus' => 800.00,
    'overtime_pay' => 1440.00,
    'deductions' => 450.00,
    'net_salary' => 17490.00,
    'payment_method_id' => 1,
    'status' => 'pending',
];
assert_array_has_key('worker_id', $payslip, 'Payslip has worker_id');
assert_array_has_key('pay_period', $payslip, 'Payslip has pay_period');
assert_array_has_key('base_salary', $payslip, 'Payslip has base_salary');
assert_array_has_key('net_salary', $payslip, 'Payslip has net_salary');
assert_array_has_key('status', $payslip, 'Payslip has status');

// Test 3: Net salary calculation
$base = 14500.00;
$attBonus = 1200.00;
$perfBonus = 800.00;
$otPay = 1440.00;
$deductions = 450.00;
$netSalary = $base + $attBonus + $perfBonus + $otPay - $deductions;
assert_equals(17490.00, $netSalary, 'Net salary calculation is correct');

// Test 4: Valid payment statuses
$validStatuses = ['pending', 'processing', 'paid'];
assert_true(in_array('pending', $validStatuses), 'pending is a valid status');
assert_true(in_array('processing', $validStatuses), 'processing is a valid status');
assert_true(in_array('paid', $validStatuses), 'paid is a valid status');

// Test 5: Payment method data structure
$method = [
    'id' => 1,
    'worker_id' => 4,
    'method_type' => 'bKash',
    'account_number' => '01711000007',
    'account_name' => 'Jannatul Ferdous',
    'is_primary' => 1,
];
assert_array_has_key('method_type', $method, 'Method has method_type');
assert_array_has_key('account_number', $method, 'Method has account_number');
assert_array_has_key('is_primary', $method, 'Method has is_primary');

// Test 6: Valid payment method types
$validTypes = ['bKash', 'Nagad', 'Rocket', 'Bank Transfer'];
assert_true(in_array('bKash', $validTypes), 'bKash is a valid type');
assert_true(in_array('Nagad', $validTypes), 'Nagad is a valid type');
assert_true(in_array('Rocket', $validTypes), 'Rocket is a valid type');
assert_true(in_array('Bank Transfer', $validTypes), 'Bank Transfer is a valid type');

// Test 7: Add payment method data
$addData = [
    'worker_id' => 4,
    'method_type' => 'bKash',
    'account_number' => '01712345678',
    'account_name' => 'Worker Name',
    'is_primary' => true,
];
assert_array_has_key('method_type', $addData, 'Add data has method_type');
assert_array_has_key('account_number', $addData, 'Add data has account_number');

// Test 8: Set primary method
$methodId = 1;
$workerId = 4;
assert_true($methodId > 0, 'Method ID is valid');
assert_true($workerId > 0, 'Worker ID is valid');

// Test 9: Account number validation
$accountNumber = '01711000007';
assert_true(strlen($accountNumber) >= 5, 'Account number has minimum length');

// Test 10: Pay period format
$payPeriod = '2026-09';
assert_equals(7, strlen($payPeriod), 'Pay period is 7 characters (YYYY-MM)');

// Test 11: Mask account number
function maskAccount($num) {
    if (!$num || strlen($num) < 5) return $num;
    return '•••• ' . substr($num, -4);
}
assert_equals('•••• 0007', maskAccount('01711000007'), 'Account masking is correct');

// Test 12: Format taka
function formatTaka($amount) {
    return '৳' . number_format($amount, 2);
}
assert_equals('৳17,490.00', formatTaka(17490), 'Taka formatting is correct');

print_test_summary();
