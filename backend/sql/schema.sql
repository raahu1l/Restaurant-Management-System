-- Saffron & Slate Restaurant Management System
-- MySQL 8.0.16+ (CHECK constraints are enforced from 8.0.16)
CREATE DATABASE IF NOT EXISTS restaurant_management_system
  CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci;
USE restaurant_management_system;

CREATE TABLE IF NOT EXISTS customers (
  customer_id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(60) NOT NULL,
  phone CHAR(10) NOT NULL UNIQUE,
  email VARCHAR(120) NULL,
  loyalty_points INT NOT NULL DEFAULT 0,
  CONSTRAINT chk_customers_phone CHECK (phone REGEXP '^[0-9]{10}$'),
  CONSTRAINT chk_customers_loyalty CHECK (loyalty_points >= 0)
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS menu_items (
  item_id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(80) NOT NULL UNIQUE,
  category VARCHAR(30) NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  is_available TINYINT(1) NOT NULL DEFAULT 1,
  CONSTRAINT chk_menu_category CHECK (category IN ('Starter','Soup','Main Course','Bread','Dessert','Beverage')),
  CONSTRAINT chk_menu_price CHECK (price >= 1),
  CONSTRAINT chk_menu_available CHECK (is_available IN (0,1))
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS restaurant_tables (
  table_id INT AUTO_INCREMENT PRIMARY KEY,
  table_number INT NOT NULL UNIQUE,
  capacity INT NOT NULL,
  status VARCHAR(20) NOT NULL DEFAULT 'Available',
  CONSTRAINT chk_table_number CHECK (table_number >= 1),
  CONSTRAINT chk_table_capacity CHECK (capacity BETWEEN 1 AND 20),
  CONSTRAINT chk_table_status CHECK (status IN ('Available','Occupied','Reserved'))
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS staff (
  staff_id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(60) NOT NULL,
  role VARCHAR(30) NOT NULL,
  phone CHAR(10) NOT NULL UNIQUE,
  salary DECIMAL(10,2) NOT NULL,
  hire_date DATE NOT NULL,
  CONSTRAINT chk_staff_role CHECK (role IN ('Manager','Chef','Waiter','Cashier')),
  CONSTRAINT chk_staff_phone CHECK (phone REGEXP '^[0-9]{10}$'),
  CONSTRAINT chk_staff_salary CHECK (salary >= 0)
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS orders (
  order_id INT AUTO_INCREMENT PRIMARY KEY,
  customer_id INT NULL,
  table_id INT NOT NULL,
  staff_id INT NOT NULL,
  order_date DATE NOT NULL,
  status VARCHAR(20) NOT NULL DEFAULT 'Pending',
  CONSTRAINT chk_order_status CHECK (status IN ('Pending','Preparing','Served','Completed','Cancelled')),
  CONSTRAINT fk_orders_customer FOREIGN KEY (customer_id) REFERENCES customers(customer_id) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT fk_orders_table FOREIGN KEY (table_id) REFERENCES restaurant_tables(table_id) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT fk_orders_staff FOREIGN KEY (staff_id) REFERENCES staff(staff_id) ON DELETE RESTRICT ON UPDATE CASCADE,
  INDEX idx_orders_date (order_date), INDEX idx_orders_status (status)
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS order_items (
  order_item_id INT AUTO_INCREMENT PRIMARY KEY,
  order_id INT NOT NULL,
  item_id INT NOT NULL,
  quantity INT NOT NULL DEFAULT 1,
  CONSTRAINT chk_order_item_quantity CHECK (quantity BETWEEN 1 AND 50),
  CONSTRAINT fk_order_items_order FOREIGN KEY (order_id) REFERENCES orders(order_id) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT fk_order_items_menu FOREIGN KEY (item_id) REFERENCES menu_items(item_id) ON DELETE RESTRICT ON UPDATE CASCADE,
  INDEX idx_order_items_order (order_id)
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS bills (
  bill_id INT AUTO_INCREMENT PRIMARY KEY,
  order_id INT NOT NULL UNIQUE,
  bill_date DATE NOT NULL,
  subtotal DECIMAL(10,2) NOT NULL,
  tax DECIMAL(10,2) NOT NULL DEFAULT 0,
  total DECIMAL(10,2) NOT NULL,
  status VARCHAR(20) NOT NULL DEFAULT 'Unpaid',
  CONSTRAINT chk_bill_subtotal CHECK (subtotal >= 0),
  CONSTRAINT chk_bill_tax CHECK (tax >= 0),
  CONSTRAINT chk_bill_total CHECK (total >= 0),
  CONSTRAINT chk_bill_status CHECK (status IN ('Unpaid','Paid')),
  CONSTRAINT fk_bills_order FOREIGN KEY (order_id) REFERENCES orders(order_id) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS payments (
  payment_id INT AUTO_INCREMENT PRIMARY KEY,
  bill_id INT NOT NULL,
  amount DECIMAL(10,2) NOT NULL,
  method VARCHAR(20) NOT NULL,
  payment_date DATE NOT NULL,
  CONSTRAINT chk_payment_amount CHECK (amount >= 1),
  CONSTRAINT chk_payment_method CHECK (method IN ('Cash','Card','UPI')),
  CONSTRAINT fk_payments_bill FOREIGN KEY (bill_id) REFERENCES bills(bill_id) ON DELETE RESTRICT ON UPDATE CASCADE,
  INDEX idx_payments_date (payment_date)
) ENGINE=InnoDB;
