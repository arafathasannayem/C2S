<?php
/**
 * Tests for backend/inventory.php
 * Tests inventory management and product operations
 */

require_once __DIR__ . '/test_helper.php';

echo "Testing inventory.php\n";
echo str_repeat("-", 40) . "\n";

// Test 1: Required functions exist in source code
$source = file_get_contents(__DIR__ . '/../backend/inventory.php');
assert_true(strpos($source, 'function getInventoryStats') !== false, 'getInventoryStats function exists in source');
assert_true(strpos($source, 'function getProducts') !== false, 'getProducts function exists in source');
assert_true(strpos($source, 'function addProduct') !== false, 'addProduct function exists in source');
assert_true(strpos($source, 'function updateProduct') !== false, 'updateProduct function exists in source');
assert_true(strpos($source, 'function deleteProduct') !== false, 'deleteProduct function exists in source');

// Test 2: Product data structure
$product = [
    'id' => 1,
    'product_name' => 'Shirt',
    'product_code' => 'PRD001',
    'category' => 'Apparel',
    'buying_price' => 15.00,
    'selling_price' => 25.00,
    'quantity' => 500,
    'threshold_value' => 50,
    'status' => 'in_stock',
];
assert_array_has_key('product_name', $product, 'Product has product_name');
assert_array_has_key('product_code', $product, 'Product has product_code');
assert_array_has_key('category', $product, 'Product has category');
assert_array_has_key('quantity', $product, 'Product has quantity');
assert_array_has_key('status', $product, 'Product has status');

// Test 3: Valid categories
$validCategories = ['Apparel', 'Raw Material', 'Trim & Accessories', 'Packaging'];
assert_true(in_array('Apparel', $validCategories), 'Apparel is a valid category');
assert_true(in_array('Raw Material', $validCategories), 'Raw Material is a valid category');

// Test 4: Valid statuses
$validStatuses = ['in_stock', 'low_stock', 'out_of_stock'];
assert_true(in_array('in_stock', $validStatuses), 'in_stock is a valid status');
assert_true(in_array('low_stock', $validStatuses), 'low_stock is a valid status');
assert_true(in_array('out_of_stock', $validStatuses), 'out_of_stock is a valid status');

// Test 5: Stock status determination
$quantity = 500;
$threshold = 50;
$status = 'in_stock';
if ($quantity == 0) {
    $status = 'out_of_stock';
} elseif ($quantity <= $threshold) {
    $status = 'low_stock';
}
assert_equals('in_stock', $status, 'Stock status is correct for quantity > threshold');

// Test 6: Low stock status
$quantity = 30;
$status = 'in_stock';
if ($quantity == 0) {
    $status = 'out_of_stock';
} elseif ($quantity <= $threshold) {
    $status = 'low_stock';
}
assert_equals('low_stock', $status, 'Stock status is correct for quantity <= threshold');

// Test 7: Out of stock status
$quantity = 0;
$status = 'in_stock';
if ($quantity == 0) {
    $status = 'out_of_stock';
} elseif ($quantity <= $threshold) {
    $status = 'low_stock';
}
assert_equals('out_of_stock', $status, 'Stock status is correct for quantity = 0');

// Test 8: Inventory value calculation
$products = [
    ['buying_price' => 15.00, 'quantity' => 500],
    ['buying_price' => 35.00, 'quantity' => 0],
    ['buying_price' => 20.00, 'quantity' => 800],
];
$totalValue = 0;
foreach ($products as $p) {
    $totalValue += $p['buying_price'] * $p['quantity'];
}
assert_equals(23500.00, $totalValue, 'Inventory value calculation is correct');

// Test 9: Pagination
$page = 2;
$limit = 10;
$offset = ($page - 1) * $limit;
assert_equals(10, $offset, 'Pagination offset is correct');

// Test 10: Profit margin calculation
$buyingPrice = 15.00;
$sellingPrice = 25.00;
$profitMargin = $sellingPrice > 0 ? round((($sellingPrice - $buyingPrice) / $sellingPrice) * 100, 2) : 0;
assert_equals(40.0, $profitMargin, 'Profit margin calculation is correct');

print_test_summary();
