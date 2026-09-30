<?php
/**
 * C2S Backend Test Runner
 * Run all tests: php tests/run_all_tests.php
 */

require_once __DIR__ . '/test_helper.php';

echo str_repeat("=", 60) . "\n";
echo "  C2S BACKEND TEST SUITE\n";
echo str_repeat("=", 60) . "\n\n";

$testFiles = [
    'config_test.php',
    'auth_test.php',
    'dashboard_test.php',
    'workers_test.php',
    'attendance_test.php',
    'production_test.php',
    'inventory_test.php',
    'quality_test.php',
    'safety_test.php',
    'jobs_test.php',
    'machines_test.php',
    'waste_test.php',
    'ai_test.php',
    'reports_test.php',
    'chats_test.php',
    'users_test.php',
    'worker_dashboard_test.php',
    'worker_payment_test.php',
    'worker_settings_test.php',
];

$totalPassed = 0;
$totalFailed = 0;

foreach ($testFiles as $testFile) {
    $filePath = __DIR__ . '/' . $testFile;
    if (file_exists($filePath)) {
        // Reset counters for each test file
        $testResults = ['passed' => 0, 'failed' => 0, 'errors' => []];

        // Capture output
        ob_start();
        require_once $filePath;
        $output = ob_get_clean();

        echo $output;

        $totalPassed += $testResults['passed'];
        $totalFailed += $testResults['failed'];
    } else {
        echo "  [SKIP] {$testFile} not found\n";
    }
}

echo "\n" . str_repeat("=", 60) . "\n";
echo "  OVERALL TEST SUMMARY\n";
echo str_repeat("=", 60) . "\n";
echo "  Total Passed: {$totalPassed}\n";
echo "  Total Failed: {$totalFailed}\n";
echo "  Total Tests:  " . ($totalPassed + $totalFailed) . "\n";
echo str_repeat("=", 60) . "\n";

if ($totalFailed > 0) {
    echo "\n  SOME TESTS FAILED - Review output above for details.\n";
    exit(1);
} else {
    echo "\n  ALL TESTS PASSED!\n";
    exit(0);
}
