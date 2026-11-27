# Saffron & Slate — Restaurant Management System

A full-stack academic DBMS project. Frontend: React + Vite. Backend: Node.js + Express. Database: MySQL 8.0.16+.

## Repository structure

- `frontend/` — existing React/Vite interface.
- `backend/` — REST API and MySQL integration.
- `backend/sql/schema.sql` — database and eight relational tables.
- `backend/sql/seed.sql` — 93 sample rows matching the frontend seed generator.
- `backend/sql/views.sql` — three reporting views.
- `backend/sql/queries.sql` — fourteen demonstration SQL queries.
- `docs/` — ER diagram, architecture, report notes, test cases and PPT outline.

## Setup

### 1. Create the database

Use MySQL 8.0.16 or newer. In MySQL Workbench, execute in this order:

1. `backend/sql/schema.sql`
2. `backend/sql/seed.sql` (run once on an empty database)
3. `backend/sql/views.sql`

Verify seed counts:

```sql
USE restaurant_management_system;
SELECT 'customers' AS table_name, COUNT(*) AS total FROM customers
UNION ALL SELECT 'menu_items', COUNT(*) FROM menu_items
UNION ALL SELECT 'restaurant_tables', COUNT(*) FROM restaurant_tables
UNION ALL SELECT 'staff', COUNT(*) FROM staff
UNION ALL SELECT 'orders', COUNT(*) FROM orders
UNION ALL SELECT 'order_items', COUNT(*) FROM order_items
UNION ALL SELECT 'bills', COUNT(*) FROM bills
UNION ALL SELECT 'payments', COUNT(*) FROM payments;
```

Expected total: 93 records (10 + 15 + 8 + 6 + 12 + 24 + 10 + 8).

### 2. Configure and run backend

```bash
cd backend
npm install
```

Copy `.env.example` to `.env`, then set your local MySQL username and password. Do not commit `.env`.

```bash
npm run dev
```

Health check: `http://localhost:5000/api/health`

### 3. Connect frontend

Create `frontend/.env` with:

```env
VITE_API_URL=http://localhost:5000/api
```

Then run:

```bash
cd frontend
npm install
npm run dev
```

Restart Vite after changing `.env`. With `VITE_API_URL` configured, the app uses the real MySQL API instead of browser demo/localStorage mode.

## API contract

For each entity (`customers`, `menu_items`, `restaurant_tables`, `staff`, `orders`, `order_items`, `bills`, `payments`):

- `GET /api/:entity` — list records; supports exact filters, `search`, `startDate`, `endDate`, `minAmount`, `maxAmount`, `sortBy`, `order`.
- `POST /api/:entity` — insert a record.
- `PUT /api/:entity/:id` — update a record.
- `DELETE /api/:entity/:id` — delete a record if no dependent records prevent it.

Report endpoints:

- `GET /api/reports/dashboard`
- `GET /api/reports/sales-by-day?startDate=2026-11-10&endDate=2026-11-30`
- `GET /api/reports/top-items`
- `GET /api/reports/staff-performance`
- `GET /api/reports/payment-methods`
- `GET /api/reports/outstanding-bills`

All SQL values are parameterized. Table and column identifiers are selected from a server-side allow-list. Errors are returned as JSON `{ "error": "..." }`, as expected by the frontend.

## Important academic notes

- The schema contains eight related tables, primary/foreign keys, `NOT NULL`, `UNIQUE`, `CHECK`, and `DEFAULT` constraints.
- Foreign keys use `ON DELETE RESTRICT` and `ON UPDATE CASCADE` to protect transaction history.
- `queries.sql` demonstrates SELECT, WHERE, ORDER BY, JOIN, nested queries, aggregate functions, GROUP BY and HAVING, multi-criteria filtering, and top-selling products.
- `views.sql` defines three views: order overview, order item details, and bill/payment summary.
- Refer to `docs/` for the ER diagram, architecture, normalization explanation, test plan, report structure and presentation outline.
