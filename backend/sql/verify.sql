USE restaurant_management_system;

-- Verify all eight tables and total seeded records.
SELECT 'customers' AS table_name, COUNT(*) AS record_count FROM customers
UNION ALL SELECT 'menu_items', COUNT(*) FROM menu_items
UNION ALL SELECT 'restaurant_tables', COUNT(*) FROM restaurant_tables
UNION ALL SELECT 'staff', COUNT(*) FROM staff
UNION ALL SELECT 'orders', COUNT(*) FROM orders
UNION ALL SELECT 'order_items', COUNT(*) FROM order_items
UNION ALL SELECT 'bills', COUNT(*) FROM bills
UNION ALL SELECT 'payments', COUNT(*) FROM payments;

SELECT
 (SELECT COUNT(*) FROM customers) + (SELECT COUNT(*) FROM menu_items) +
 (SELECT COUNT(*) FROM restaurant_tables) + (SELECT COUNT(*) FROM staff) +
 (SELECT COUNT(*) FROM orders) + (SELECT COUNT(*) FROM order_items) +
 (SELECT COUNT(*) FROM bills) + (SELECT COUNT(*) FROM payments) AS total_sample_records;

-- Confirm all three views exist and can be queried.
SELECT COUNT(*) AS order_overview_rows FROM v_order_overview;
SELECT COUNT(*) AS order_item_detail_rows FROM v_order_item_details;
SELECT COUNT(*) AS bill_summary_rows FROM v_bill_payment_summary;


USE restaurant_management_system;

SELECT * FROM customers;
SELECT COUNT(*) FROM menu_items;
SELECT COUNT(*) FROM restaurant_tables;
SELECT COUNT(*) FROM staff;
SELECT COUNT(*) FROM orders;
SELECT COUNT(*) FROM order_items;
SELECT COUNT(*) FROM bills;
SELECT COUNT(*) FROM payments;