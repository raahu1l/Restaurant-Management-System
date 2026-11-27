# Saffron & Slate: Restaurant Management System (React frontend)

DBMS mini project #6. React 18 + Vite. No UI library, so it is easy to explain in a viva.

## Run it
1. Install Node.js 18 or newer from https://nodejs.org
2. Open a terminal in this folder and run:
   ```
   npm install
   npm run dev
   ```
3. Open http://localhost:5173

With no backend configured it runs in **demo mode**: 93 sample records are stored in the browser,
and unique keys, foreign keys and delete restrictions behave like MySQL. "Reset demo data" is in the sidebar.

## Connect the real backend (MySQL)
1. Copy `.env.example` to `.env`
2. Set `VITE_API_URL=http://localhost:5000/api` (your teammate's URL)
3. Restart `npm run dev`. The sidebar badge changes to "Connected to MySQL API".

### What the backend must provide
Tables (8): `customers, menu_items, restaurant_tables, staff, orders, order_items, bills, payments`.
For each table name `{t}`:

| Method | URL | Returns |
|---|---|---|
| GET | `/{t}` | array of rows |
| POST | `/{t}` | created row |
| PUT | `/{t}/{id}` | updated row |
| DELETE | `/{t}/{id}` | `{ "success": true }` |

On failure send a non-2xx status and `{ "error": "message" }`. The message is shown to the user as a toast
(for example `Duplicate entry '9822000010' for key 'phone'`, or a foreign key failure).
Enable CORS on the backend. Column names and rules are in `src/config.js`.
Primary keys: `customer_id, item_id, table_id, staff_id, order_id, order_item_id, bill_id, payment_id`.
Foreign keys: orders(customer_id, table_id, staff_id), order_items(order_id, item_id), bills(order_id), payments(bill_id).
Dates use `YYYY-MM-DD`. Reports are calculated in the browser from these lists, so no extra endpoints are needed.

## Requirement checklist
- 8 forms with add, edit, delete and view (Customers, Menu items, Tables, Staff, Orders, Order items, Bills, Payments)
- Validation: required, number range, 10-digit phone, email format, duplicate key, foreign key, delete restriction
- Search and filter on every table, sortable columns
- Reports: sales summary (date and status filter, totals, averages), top items (HAVING-style minimum), payments by method,
  staff performance, multi-criteria order search (joins 5 tables)
- Dashboard with totals and status chart

## Folder guide
- `src/config.js`: table definitions, fields and validation rules
- `src/api.js`: demo mode and real REST calls
- `src/components/`: CrudPage (all forms), Dashboard, Reports
