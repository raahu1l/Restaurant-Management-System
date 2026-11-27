# Project Report Content Guide

Use Calibri (Body), 12 pt, print double-sided as instructed. Replace bracketed placeholders with your details and actual screenshots/results.

## 1. Introduction and Problem Statement
Saffron & Slate is a restaurant management system designed to organize common restaurant operations through a centralized application. Restaurants handle customer details, menu information, table allocation, staff, orders, billing and payments. Maintaining these records separately can cause duplication, inconsistent information and difficulty preparing reports. The proposed system stores related information in a MySQL relational database and provides a React-based interface for managing records and viewing operational summaries.

**Problem statement:** To design and implement a database-driven restaurant management application that supports reliable CRUD operations, maintains relationships between restaurant records, validates data and generates useful searches and reports.

**Objectives:** Maintain customer, menu, table and staff records; record orders and order items; generate bills and record payments; enforce relational integrity; support searching and filtering; and generate summary reports.

## 2. Requirement Analysis and System Architecture
**Functional requirements:** Add, view, edit and delete customer, menu item, table, staff, order, order item, bill and payment records; search/filter records; display dashboard summaries; view sales, popular menu items, staff performance and payment reports; reject invalid or duplicate data; prevent deletion of records referenced by dependent records.

**Technology stack:** React + Vite frontend; Node.js runtime; Express.js REST API; MySQL 8.0.16+ database; `mysql2` Node.js driver; `cors` and `dotenv` packages; VS Code and MySQL Workbench for development/testing. Record the exact installed versions from `node -v`, `npm -v` and `SELECT VERSION()` before final submission.

Insert the system block diagram from `ARCHITECTURE.md`.

## 3. Database Design
Insert the ER diagram from `ER-DIAGRAM.md`. Explain the eight entities and their relationships. Use `schema.sql` to prepare the relational schema table containing each column, data type, nullability, PK, FK and referential action. Insert the normalization proof from `NORMALIZATION.md`.

## 4. Implementation Details
Explain `schema.sql`, `seed.sql`, `views.sql`, `queries.sql`, Express routes/controllers, database connection pool and centralized error handling. Include screenshots of SQL execution and the 93-row verification. Describe the purpose of each of the 14 queries in `queries.sql`.

## 5. Frontend and UI Integration
Include screenshots and short descriptions of at least five forms. The app contains eight entity management sections. Demonstrate create, view, update and delete. Include validation screenshots for required fields, duplicate unique values, invalid values and protected deletion.

## 6. Testing and Validation
Use `TEST-CASES.md`. Fill in actual output and Pass/Fail after running tests. Attach evidence screenshots for important cases.

## 7. Conclusion and Future Enhancements
The project demonstrates a relational database-backed restaurant management application with eight related entities, REST-based CRUD operations, integrity constraints, reporting views and SQL queries. It centralizes restaurant records and supports common operational searches and summaries.

**Future enhancements:** Role-based authentication for manager/cashier/waiter; inventory and ingredient stock tracking; reservation management and automated notifications; deployment to a hosted server with backup and audit logging.
