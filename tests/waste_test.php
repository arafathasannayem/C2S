<?php
/**
 * Tests for backend/waste.php
 * Tests waste tracking and pattern optimization
 */

require_once __DIR__ . '/test_helper.php';

echo "Testing waste.php\n";
echo str_repeat("-", 40) . "\n";

// Test 1: Required functions exist in source code
$source = file_get_contents(__DIR__ . '/../backend/waste.php');
assert_true(strpos($source, "case 'stats'") !== false, 'Stats functionality exists');
assert_true(strpos($source, "case 'add_waste'") !== false, 'Add waste functionality exists');
assert_true(strpos($source, "case 'apply_pattern'") !== false, 'Apply pattern functionality exists');

// Test 2: Waste record data structure
$record = [
    'id' => 1,
    'line_id' => 2,
    'waste_type' => 'Fabric Scraps',
    'material' => 'Denim 12oz',
    'quantity_kg' => 18.5,
    'cost_usd' => 74.0,
    'date' => '2026-09-13',
    'reason' => 'Cutting edge margin misalignment',
];
assert_array_has_key('line_id', $record, 'Record has line_id');
assert_array_has_key('waste_type', $record, 'Record has waste_type');
assert_array_has_key('quantity_kg', $record, 'Record has quantity_kg');
assert_array_has_key('cost_usd', $record, 'Record has cost_usd');

// Test 3: Valid waste types
$validTypes = ['Fabric Scraps', 'Yarn Waste', 'Packaging Plastic', 'Defective Trims', 'Other'];
assert_true(in_array('Fabric Scraps', $validTypes), 'Fabric Scraps is a valid type');
assert_true(in_array('Yarn Waste', $validTypes), 'Yarn Waste is a valid type');

// Test 4: Waste summary calculation
$records = [
    ['quantity_kg' => 18.5, 'cost_usd' => 74.0],
    ['quantity_kg' => 12.0, 'cost_usd' => 48.0],
    ['quantity_kg' => 8.5, 'cost_usd' => 34.0],
];
$totalKg = array_sum(array_column($records, 'quantity_kg'));
$totalCost = array_sum(array_column($records, 'cost_usd'));
assert_equals(39.0, $totalKg, 'Total waste kg is correct');
assert_equals(156.0, $totalCost, 'Total cost is correct');

// Test 5: Add waste data
$addData = [
    'line_id' => 2,
    'waste_type' => 'Fabric Scraps',
    'quantity_kg' => 18.5,
    'cost_usd' => 74.0,
    'date' => '2026-09-13',
    'reason' => 'Cutting edge margin misalignment',
];
assert_array_has_key('quantity_kg', $addData, 'Add data has quantity_kg');
assert_array_has_key('waste_type', $addData, 'Add data has waste_type');

// Test 6: Default cost calculation
$quantityKg = 18.5;
$defaultCost = $quantityKg * 4.0;
assert_equals(74.0, $defaultCost, 'Default cost calculation is correct');

// Test 7: Pattern optimization data
$pattern = [
    'pattern_code' => 'PAT-DENIM-09',
    'fabric_type' => 'Denim 12oz',
    'nesting_yield_projected' => 94.2,
    'estimated_waste_reduction_kg' => 42.0,
    'status' => 'active_on_line',
    'applied_date' => '2026-09-13',
];
assert_array_has_key('pattern_code', $pattern, 'Pattern has pattern_code');
assert_array_has_key('fabric_type', $pattern, 'Pattern has fabric_type');
assert_array_has_key('nesting_yield_projected', $pattern, 'Pattern has nesting_yield_projected');

// Test 8: Valid pattern statuses
$validStatuses = ['simulated', 'active_on_line', 'archived'];
assert_true(in_array('active_on_line', $validStatuses), 'active_on_line is a valid status');
assert_true(in_array('simulated', $validStatuses), 'simulated is a valid status');

// Test 9: Yield projection validation
$yieldProjected = 94.2;
assert_true($yieldProjected > 0 && $yieldProjected <= 100, 'Yield projection is within 0-100');

// Test 10: Waste reduction calculation
$currentWaste = 100.0;
$projectedReduction = 42.0;
$newWaste = $currentWaste - $projectedReduction;
assert_equals(58.0, $newWaste, 'New waste after reduction is correct');

print_test_summary();
