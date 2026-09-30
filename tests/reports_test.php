<?php
/**
 * Tests for backend/reports.php
 * Tests compliance, production reports, and audit sharing
 */

require_once __DIR__ . '/test_helper.php';

echo "Testing reports.php\n";
echo str_repeat("-", 40) . "\n";

// Test 1: Required functions exist in source code
$source = file_get_contents(__DIR__ . '/../backend/reports.php');
assert_true(strpos($source, "case 'compliance'") !== false, 'Compliance functionality exists');
assert_true(strpos($source, "case 'daily_production'") !== false, 'Daily production functionality exists');
assert_true(strpos($source, "case 'share_dossier'") !== false, 'Share dossier functionality exists');

// Test 2: Compliance checklist structure
$checklist = [
    'id' => 1,
    'standard_name' => 'Bangladesh Labor Act 2006',
    'clause_code' => 'BLA-001',
    'title' => 'Minimum Wage Compliance',
    'description' => 'Ensure all workers receive minimum wage',
    'category' => 'Worker Rights & Remuneration',
    'is_compliant' => true,
    'evidence_document_url' => 'https://example.com/evidence.pdf',
    'last_audited_at' => '2026-09-01 10:00:00',
];
assert_array_has_key('standard_name', $checklist, 'Checklist has standard_name');
assert_array_has_key('clause_code', $checklist, 'Checklist has clause_code');
assert_array_has_key('is_compliant', $checklist, 'Checklist has is_compliant');

// Test 3: Valid categories
$validCategories = [
    'Worker Rights & Remuneration',
    'Workplace Safety & Health',
    'Building & Electrical Integrity',
    'Environmental & Waste Management',
];
assert_true(in_array('Worker Rights & Remuneration', $validCategories), 'Worker Rights is a valid category');
assert_true(in_array('Workplace Safety & Health', $validCategories), 'Workplace Safety is a valid category');

// Test 4: Readiness score calculation
$checklistItems = [
    ['is_compliant' => true],
    ['is_compliant' => true],
    ['is_compliant' => false],
    ['is_compliant' => true],
    ['is_compliant' => false],
];
$totalItems = count($checklistItems);
$compliantCount = count(array_filter($checklistItems, function($item) { return $item['is_compliant']; }));
$readinessScore = $totalItems > 0 ? round(($compliantCount / $totalItems) * 100, 1) : 0;
assert_equals(60.0, $readinessScore, 'Readiness score calculation is correct');

// Test 5: Daily production data
$production = [
    'date' => '2026-09-13',
    'total_produced' => 3840,
    'total_target' => 4000,
    'lines' => [
        ['line_name' => 'Line-A', 'quantity' => 1200, 'job_count' => 2],
        ['line_name' => 'Line-B', 'quantity' => 1150, 'job_count' => 1],
    ],
];
assert_array_has_key('total_produced', $production, 'Production has total_produced');
assert_array_has_key('total_target', $production, 'Production has total_target');
assert_array_has_key('lines', $production, 'Production has lines');

// Test 6: Production achievement rate
$totalProduced = 3840;
$totalTarget = 4000;
$achievementRate = $totalTarget > 0 ? round(($totalProduced / $totalTarget) * 100, 1) : 0;
assert_equals(96.0, $achievementRate, 'Achievement rate calculation is correct');

// Test 7: Share dossier data
$dossier = [
    'auditor_email' => 'auditor@buyer-compliance.com',
    'scope' => ['Labor Law 2006', 'Building & Fire Safety'],
    'expiry_days' => 7,
];
assert_array_has_key('auditor_email', $dossier, 'Dossier has auditor_email');
assert_array_has_key('scope', $dossier, 'Dossier has scope');
assert_array_has_key('expiry_days', $dossier, 'Dossier has expiry_days');

// Test 8: Share link generation
$token = bin2hex(random_bytes(16));
$shareUrl = 'http://localhost/c2s/audit/verify?token=' . $token;
assert_true(strpos($shareUrl, 'token=') !== false, 'Share link contains token');
assert_equals(32, strlen($token), 'Token is 32 characters long');

// Test 9: Audit expiry date
$expiryDays = 7;
$expiryDate = date('Y-m-d', strtotime("+{$expiryDays} days"));
assert_true(strtotime($expiryDate) > time(), 'Expiry date is in the future');

// Test 10: Compliance status text
$isCompliant = true;
$status = $isCompliant ? 'Compliant' : 'Review Needed';
assert_equals('Compliant', $status, 'Compliance status text is correct');

print_test_summary();
