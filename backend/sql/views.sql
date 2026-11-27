USE restaurant_management_system;

-- View 1: One row per order with customer (or Walk-in), table and staff details.
CREATE OR REPLACE VIEW v_order_overview AS
SELECT o.order_id, o.order_date, o.status,
       COALESCE(c.name, 'Walk-in Customer') AS customer_name,
       rt.table_number, s.name AS staff_name, s.role AS staff_role
FROM orders o
LEFT JOIN customers c ON c.customer_id = o.customer_id
JOIN restaurant_tables rt ON rt.table_id = o.table_id
JOIN staff s ON s.staff_id = o.staff_id;

-- View 2: One row per order item, including menu details and calculated line value.
CREATE OR REPLACE VIEW v_order_item_details AS
SELECT oi.order_item_id, oi.order_id, mi.item_id, mi.name AS item_name,
       mi.category, mi.price AS unit_price, oi.quantity,
       (mi.price * oi.quantity) AS line_total
FROM order_items oi
JOIN menu_items mi ON mi.item_id = oi.item_id;

-- View 3: Billing and payment summary for each bill.
CREATE OR REPLACE VIEW v_bill_payment_summary AS
SELECT b.bill_id, b.order_id, b.bill_date, b.subtotal, b.tax, b.total,
       b.status AS bill_status,
       COALESCE(SUM(p.amount), 0) AS amount_paid,
       (b.total - COALESCE(SUM(p.amount), 0)) AS balance_due,
       COUNT(p.payment_id) AS payment_count
FROM bills b
LEFT JOIN payments p ON p.bill_id = b.bill_id
GROUP BY b.bill_id, b.order_id, b.bill_date, b.subtotal, b.tax, b.total, b.status;
