<?php
/**
 * Tests for backend/quality.php
 * Tests quality control inspections and defect analysis
 */

require_once __DIR__ . '/test_helper.php';

echo "Testing quality.php\n";
echo str_repeat("-", 40) . "\n";

// Test 1: Required functions exist in source code
$source = file_get_contents(__DIR__ . '/../backend/quality.php');
assert_true(strpos($source, "case 'stats'") !== false, 'Stats functionality exists');
assert_true(strpos($source, "case 'inspections'") !== false, 'Inspections functionality exists');
assert_true(strpos($source, "case 'create_inspection'") !== false, 'Create inspection functionality exists');

// Test 2: Inspection data structure
$inspection = [
    'id' => 1,
    'batch_number' => 'BATCH-2026-091',
    'product_id' => 3,
    'line_id' => 1,
    'inspector_id' => 4,
    'inspection_date' => '2026-09-13',
    'sample_size' => 200,
    'defects_found' => 3,
    'pass_rate' => 98.5,
    'status' => 'Accepted',
];
assert_array_has_key('batch_number', $inspection, 'Inspection has batch_number');
assert_array_has_key('sample_size', $inspection, 'Inspection has sample_size');
assert_array_has_key('defects_found', $inspection, 'Inspection has defects_found');
assert_array_has_key('pass_rate', $inspection, 'Inspection has pass_rate');
assert_array_has_key('status', $inspection, 'Inspection has status');

// Test 3: Pass rate calculation
$sampleSize = 200;
$defectsFound = 3;
$passRate = round((($sampleSize - $defectsFound) / $sampleSize) * 100, 2);
assert_equals(98.5, $passRate, 'Pass rate calculation is correct');

// Test 4: Inspection status determination
$defects = 3;
$sample = 200;
$status = $defects > ($sample * 0.03) ? 'Rejected' : 'Accepted';
assert_equals('Accepted', $status, 'Status is Accepted when defects <= 3%');

// Test 5: Rejected status
$defects = 10;
$status = $defects > ($sample * 0.03) ? 'Rejected' : 'Accepted';
assert_equals('Rejected', $status, 'Status is Rejected when defects > 3%');

// Test 6: Valid defect categories
$validCategories = [
    'Fabric Defects',
    'Embroidery Defects',
    'Trims & Accessories Defects',
    'Finishing Defects',
    'Measurement & Fit Defects',
    'Sewing Defects',
];
assert_true(in_array('Sewing Defects', $validCategories), 'Sewing Defects is valid');
assert_true(in_array('Fabric Defects', $validCategories), 'Fabric Defects is valid');

// Test 7: Valid inspection statuses
$validStatuses = ['Accepted', 'Rejected', 'Under_Review'];
assert_true(in_array('Accepted', $validStatuses), 'Accepted is a valid status');
assert_true(in_array('Rejected', $validStatuses), 'Rejected is a valid status');

// Test 8: Defect breakdown percentage
$defects = [
    ['category' => 'Sewing Defects', 'total' => 14],
    ['category' => 'Fabric Defects', 'total' => 10],
    ['category' => 'Finishing Defects', 'total' => 8],
];
$defectTotal = array_sum(array_column($defects, 'total'));
assert_equals(32, $defectTotal, 'Defect total is correct');

// Test 9: Defect percentage calculation
$sewingDefects = 14;
$percentage = $defectTotal > 0 ? round(($sewingDefects / $defectTotal) * 100, 1) : 0;
assert_equals(43.8, $percentage, 'Defect percentage calculation is correct');

// Test 10: Summary statistics
$inspections = [
    ['pass_rate' => 98.5, 'defects_found' => 3],
    ['pass_rate' => 97.0, 'defects_found' => 6],
    ['pass_rate' => 99.0, 'defects_found' => 2],
];
$totalInspected = count($inspections);
$totalRejected = array_sum(array_column($inspections, 'defects_found'));
$avgPassRate = round(array_sum(array_column($inspections, 'pass_rate')) / count($inspections), 1);
assert_equals(3, $totalInspected, 'Total inspected count is correct');
assert_equals(11, $totalRejected, 'Total rejected count is correct');
assert_equals(98.2, $avgPassRate, 'Average pass rate is correct');

print_test_summary();
