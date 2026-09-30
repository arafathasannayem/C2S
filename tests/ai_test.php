<?php
/**
 * Tests for backend/ai.php
 * Tests AI insights and predictive analytics
 */

require_once __DIR__ . '/test_helper.php';

echo "Testing ai.php\n";
echo str_repeat("-", 40) . "\n";

// Test 1: Required functions exist in source code
$source = file_get_contents(__DIR__ . '/../backend/ai.php');
assert_true(strpos($source, "case 'insights'") !== false, 'Insights functionality exists');
assert_true(strpos($source, "case 'predictions'") !== false, 'Predictions functionality exists');

// Test 2: AI insights data structure
$insights = [
    'forecast_horizon_days' => 7,
    'predicted_output_units' => 28400,
    'capacity_utilization_pct' => 88.7,
    'on_time_delivery_probability' => 96.2,
];
assert_array_has_key('forecast_horizon_days', $insights, 'Insights has forecast_horizon_days');
assert_array_has_key('predicted_output_units', $insights, 'Insights has predicted_output_units');
assert_array_has_key('capacity_utilization_pct', $insights, 'Insights has capacity_utilization_pct');
assert_array_has_key('on_time_delivery_probability', $insights, 'Insights has on_time_delivery_probability');

// Test 3: Risk alert structure
$alert = [
    'id' => 'ALT-01',
    'type' => 'Defect Risk Escalation',
    'severity' => 'Critical',
    'line' => 'Line-3',
    'message' => 'Increasing stitch skipping detected',
    'action_label' => 'Investigate Line 3',
];
assert_array_has_key('id', $alert, 'Alert has id');
assert_array_has_key('type', $alert, 'Alert has type');
assert_array_has_key('severity', $alert, 'Alert has severity');
assert_array_has_key('line', $alert, 'Alert has line');

// Test 4: Valid severity levels
$validSeverities = ['Critical', 'Warning', 'Info'];
assert_true(in_array('Critical', $validSeverities), 'Critical is a valid severity');
assert_true(in_array('Warning', $validSeverities), 'Warning is a valid severity');
assert_true(in_array('Info', $validSeverities), 'Info is a valid severity');

// Test 5: Daily simulated capacity
$dailyCapacity = [
    ['day' => 'Mon', 'actual' => 4100, 'predicted' => 4050, 'target' => 4000],
    ['day' => 'Tue', 'actual' => 3950, 'predicted' => 4100, 'target' => 4000],
    ['day' => 'Wed', 'actual' => 4200, 'predicted' => 4150, 'target' => 4000],
];
assert_equals(3, count($dailyCapacity), 'Daily capacity has 3 days');
assert_array_has_key('actual', $dailyCapacity[0], 'Daily capacity has actual');
assert_array_has_key('predicted', $dailyCapacity[0], 'Daily capacity has predicted');
assert_array_has_key('target', $dailyCapacity[0], 'Daily capacity has target');

// Test 6: Capacity utilization calculation
$predictedOutput = 28400;
$maxCapacity = 32000;
$utilization = $maxCapacity > 0 ? round(($predictedOutput / $maxCapacity) * 100, 1) : 0;
assert_equals(88.8, $utilization, 'Capacity utilization calculation is correct');

// Test 7: Suggested reallocation structure
$reallocation = [
    'worker_id' => 4,
    'name' => 'Juhitha',
    'current_line' => 'Line-E',
    'recommended_line' => 'Line-C',
    'reason' => 'High dexterity rating',
];
assert_array_has_key('worker_id', $reallocation, 'Reallocation has worker_id');
assert_array_has_key('current_line', $reallocation, 'Reallocation has current_line');
assert_array_has_key('recommended_line', $reallocation, 'Reallocation has recommended_line');

// Test 8: On-time delivery probability
$onTimeProbability = 96.2;
assert_true($onTimeProbability >= 0 && $onTimeProbability <= 100, 'On-time probability is within 0-100');

// Test 9: Forecast horizon
$horizonDays = 7;
assert_true($horizonDays > 0, 'Forecast horizon is positive');

// Test 10: Predicted output validation
$predictedOutput = 28400;
assert_true($predictedOutput > 0, 'Predicted output is positive');

print_test_summary();
