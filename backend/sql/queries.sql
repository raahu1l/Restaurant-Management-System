USE restaurant_management_system;

-- Q1. Display all menu items in ascending price order.
SELECT item_id, name, category, price FROM menu_items ORDER BY price ASC;

-- Q2. Search completed orders within a date range.
SELECT * FROM orders
WHERE status = 'Completed' AND order_date BETWEEN '2026-11-10' AND '2026-11-30'
ORDER BY order_date DESC;

-- Q3. Join orders with customer, table and staff details (walk-ins included).
SELECT * FROM v_order_overview ORDER BY order_date DESC, order_id DESC;

-- Q4. Show each order's items, quantities and line totals.
SELECT order_id, item_name, category, quantity, unit_price, line_total
FROM v_order_item_details ORDER BY order_id, item_name;

-- Q5. Calculate total revenue from paid bills.
SELECT SUM(total) AS total_revenue, COUNT(*) AS paid_bill_count
FROM bills WHERE status = 'Paid';

-- Q6. Average bill value by bill status; retain groups with average above 300.
SELECT status, COUNT(*) AS bill_count, AVG(total) AS average_bill
FROM bills GROUP BY status HAVING AVG(total) > 300;

-- Q7. Number of orders handled by each staff member (JOIN + GROUP BY).
SELECT s.staff_id, s.name, s.role, COUNT(o.order_id) AS orders_handled
FROM staff s LEFT JOIN orders o ON o.staff_id = s.staff_id
GROUP BY s.staff_id, s.name, s.role ORDER BY orders_handled DESC;

-- Q8. Menu items that have never been ordered (nested NOT EXISTS query).
SELECT mi.item_id, mi.name, mi.category
FROM menu_items mi
WHERE NOT EXISTS (SELECT 1 FROM order_items oi WHERE oi.item_id = mi.item_id);

-- Q9. Customers whose total spending is greater than the average bill total (nested query).
SELECT c.customer_id, c.name, SUM(b.total) AS total_spending
FROM customers c
JOIN orders o ON o.customer_id = c.customer_id
JOIN bills b ON b.order_id = o.order_id
GROUP BY c.customer_id, c.name
HAVING SUM(b.total) > (SELECT AVG(total) FROM bills);

-- Q10. Payment totals grouped by payment method.
SELECT method, COUNT(*) AS payment_count, SUM(amount) AS amount_collected
FROM payments GROUP BY method HAVING SUM(amount) > 0 ORDER BY amount_collected DESC;

-- Q11. Category-wise menu count, average price and maximum price.
SELECT category, COUNT(*) AS item_count, AVG(price) AS average_price, MAX(price) AS highest_price
FROM menu_items GROUP BY category ORDER BY item_count DESC;

-- Q12. Bills with outstanding balance, using the billing summary view.
SELECT bill_id, order_id, total, amount_paid, balance_due
FROM v_bill_payment_summary WHERE balance_due > 0 ORDER BY balance_due DESC;

-- Q13. Multiple-criteria search example: status + date range + minimum total.
SELECT b.bill_id, b.order_id, b.bill_date, b.total, b.status
FROM bills b
WHERE b.status = 'Paid'
  AND b.bill_date BETWEEN '2026-11-10' AND '2026-11-30'
  AND b.total >= 200
ORDER BY b.total DESC;

-- Q14. Top 5 best-selling menu items (JOIN + aggregate + ORDER BY + LIMIT).
SELECT mi.item_id, mi.name, SUM(oi.quantity) AS units_sold,
       SUM(oi.quantity * mi.price) AS sales_value
FROM menu_items mi JOIN order_items oi ON oi.item_id = mi.item_id
GROUP BY mi.item_id, mi.name ORDER BY units_sold DESC, sales_value DESC LIMIT 5;
