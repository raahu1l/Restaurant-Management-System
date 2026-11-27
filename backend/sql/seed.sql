-- Saffron & Slate sample data: mirrors frontend/src/seed.js exactly (93 records total).
-- Run schema.sql first. Run this file once on an empty database to avoid duplicate primary keys.
USE restaurant_management_system;
SET FOREIGN_KEY_CHECKS = 0;
INSERT INTO customers (customer_id, name, phone, email, loyalty_points) VALUES
(1, 'Anita Naik', '9822000010', 'anita.naik@example.com', 0),
(2, 'Rohan Fernandes', '9822000011', 'rohan.fernandes@example.com', 35),
(3, 'Priya Kamat', '9822000012', 'priya.kamat@example.com', 70),
(4, 'Joao D''Souza', '9822000013', 'joao.d.souza@example.com', 105),
(5, 'Sneha Gaonkar', '9822000014', 'sneha.gaonkar@example.com', 140),
(6, 'Amit Prabhu', '9822000015', 'amit.prabhu@example.com', 175),
(7, 'Maria Pereira', '9822000016', 'maria.pereira@example.com', 10),
(8, 'Vikram Shetty', '9822000017', 'vikram.shetty@example.com', 45),
(9, 'Neha Borkar', '9822000018', 'neha.borkar@example.com', 80),
(10, 'Kevin Rodrigues', '9822000019', 'kevin.rodrigues@example.com', 115);

INSERT INTO menu_items (item_id, name, category, price, is_available) VALUES
(1, 'Veg Spring Rolls', 'Starter', 180, 1),
(2, 'Chicken Tikka', 'Starter', 260, 1),
(3, 'Paneer Tikka', 'Starter', 240, 1),
(4, 'Tomato Soup', 'Soup', 120, 1),
(5, 'Goan Fish Curry Rice', 'Main Course', 320, 1),
(6, 'Chicken Xacuti', 'Main Course', 340, 1),
(7, 'Butter Naan', 'Bread', 40, 1),
(8, 'Veg Biryani', 'Main Course', 220, 1),
(9, 'Chicken Biryani', 'Main Course', 280, 1),
(10, 'Dal Tadka', 'Main Course', 180, 1),
(11, 'Bebinca', 'Dessert', 150, 0),
(12, 'Gulab Jamun', 'Dessert', 90, 1),
(13, 'Masala Chai', 'Beverage', 40, 1),
(14, 'Fresh Lime Soda', 'Beverage', 70, 1),
(15, 'Cold Coffee', 'Beverage', 110, 1);

INSERT INTO restaurant_tables (table_id, table_number, capacity, status) VALUES
(1, 1, 2, 'Available'),
(2, 2, 2, 'Occupied'),
(3, 3, 4, 'Reserved'),
(4, 4, 4, 'Available'),
(5, 5, 4, 'Occupied'),
(6, 6, 6, 'Reserved'),
(7, 7, 6, 'Available'),
(8, 8, 8, 'Occupied');

INSERT INTO staff (staff_id, name, role, phone, salary, hire_date) VALUES
(1, 'Suresh Kamat', 'Manager', '9764000010', 45000, '2023-01-15'),
(2, 'Ravi Gawas', 'Chef', '9764000011', 38000, '2024-02-15'),
(3, 'Deepa Naik', 'Waiter', '9764000012', 18000, '2025-03-15'),
(4, 'Ajay Dessai', 'Waiter', '9764000013', 18000, '2023-04-15'),
(5, 'Pooja Sawant', 'Cashier', '9764000014', 22000, '2024-05-15'),
(6, 'Mohan Pai', 'Chef', '9764000015', 36000, '2025-06-15');

INSERT INTO orders (order_id, customer_id, table_id, staff_id, order_date, status) VALUES
(1, 1, 1, 3, '2026-11-10', 'Completed'),
(2, 2, 2, 4, '2026-11-11', 'Completed'),
(3, 3, 3, 3, '2026-11-12', 'Served'),
(4, 4, 4, 4, '2026-11-13', 'Completed'),
(5, NULL, 5, 3, '2026-11-14', 'Preparing'),
(6, 6, 6, 4, '2026-11-15', 'Completed'),
(7, 7, 7, 3, '2026-11-16', 'Pending'),
(8, 8, 8, 4, '2026-11-17', 'Completed'),
(9, 9, 1, 3, '2026-11-18', 'Completed'),
(10, NULL, 2, 4, '2026-11-19', 'Cancelled'),
(11, 1, 3, 3, '2026-11-20', 'Preparing'),
(12, 2, 4, 4, '2026-11-21', 'Pending');

INSERT INTO order_items (order_item_id, order_id, item_id, quantity) VALUES
(1, 1, 1, 1),
(2, 1, 6, 2),
(3, 2, 3, 2),
(4, 2, 8, 2),
(5, 3, 5, 3),
(6, 3, 10, 2),
(7, 4, 7, 1),
(8, 4, 12, 2),
(9, 5, 9, 2),
(10, 5, 14, 2),
(11, 6, 11, 3),
(12, 6, 1, 2),
(13, 7, 13, 1),
(14, 7, 3, 2),
(15, 8, 15, 2),
(16, 8, 5, 2),
(17, 9, 2, 3),
(18, 9, 7, 2),
(19, 10, 4, 1),
(20, 10, 9, 2),
(21, 11, 6, 2),
(22, 11, 11, 2),
(23, 12, 8, 3),
(24, 12, 13, 2);

INSERT INTO bills (bill_id, order_id, bill_date, subtotal, tax, total, status) VALUES
(1, 1, '2026-11-10', 860, 43.0, 903.0, 'Paid'),
(2, 2, '2026-11-11', 920, 46.0, 966.0, 'Paid'),
(3, 3, '2026-11-12', 1320, 66.0, 1386.0, 'Paid'),
(4, 4, '2026-11-13', 220, 11.0, 231.0, 'Paid'),
(5, 5, '2026-11-14', 700, 35.0, 735.0, 'Paid'),
(6, 6, '2026-11-15', 810, 40.5, 850.5, 'Paid'),
(7, 7, '2026-11-16', 520, 26.0, 546.0, 'Paid'),
(8, 8, '2026-11-17', 860, 43.0, 903.0, 'Paid'),
(9, 9, '2026-11-18', 860, 43.0, 903.0, 'Unpaid'),
(10, 10, '2026-11-19', 680, 34.0, 714.0, 'Unpaid');

INSERT INTO payments (payment_id, bill_id, amount, method, payment_date) VALUES
(1, 1, 903.0, 'Cash', '2026-11-10'),
(2, 2, 966.0, 'Card', '2026-11-11'),
(3, 3, 1386.0, 'UPI', '2026-11-12'),
(4, 4, 231.0, 'Cash', '2026-11-13'),
(5, 5, 735.0, 'Card', '2026-11-14'),
(6, 6, 850.5, 'UPI', '2026-11-15'),
(7, 7, 546.0, 'Cash', '2026-11-16'),
(8, 8, 903.0, 'Card', '2026-11-17');

SET FOREIGN_KEY_CHECKS = 1;
-- Expected row counts: customers 10, menu_items 15, restaurant_tables 8,
-- staff 6, orders 12, order_items 24, bills 10, payments 8. Total = 93.
