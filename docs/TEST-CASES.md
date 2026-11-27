# Testing and Validation Plan

Record the actual result and mark Pass/Fail after running each test in the local environment. Do not claim a test passed until it has been executed.

| ID | Test / input | Expected output | Actual output | Status |
|---|---|---|---|---|
| T01 | Open `/api/health` with MySQL running | JSON status `ok`, database `connected` | To be recorded | Pending |
| T02 | GET `/api/customers` | Customer list returned | To be recorded | Pending |
| T03 | POST customer with valid name and unique 10-digit phone | HTTP 201 and inserted row | To be recorded | Pending |
| T04 | POST customer using an existing phone | HTTP 409 duplicate-value message | To be recorded | Pending |
| T05 | POST customer with missing required name | HTTP 400 validation message | To be recorded | Pending |
| T06 | POST customer with non-numeric/short phone | Database CHECK rejects; HTTP 400 | To be recorded | Pending |
| T07 | PUT an existing menu item price | HTTP 200 and updated row | To be recorded | Pending |
| T08 | DELETE a menu item referenced by an order item | HTTP 409 related-record protection | To be recorded | Pending |
| T09 | POST an order with nonexistent table_id | HTTP 400 foreign-key message | To be recorded | Pending |
| T10 | GET `/api/orders?status=Completed&startDate=2026-11-10&endDate=2026-11-30` | Matching date/status records only | To be recorded | Pending |
| T11 | GET `/api/reports/top-items` | Aggregated menu item sales | To be recorded | Pending |
| T12 | Execute `views.sql` and select from all 3 views | All views return rows / valid summaries | To be recorded | Pending |
| T13 | Execute all statements in `queries.sql` | All 14 queries execute successfully | To be recorded | Pending |
| T14 | GET unknown endpoint | HTTP 404 JSON error | To be recorded | Pending |

## Screenshots to capture for report
1. MySQL Workbench showing all eight tables.
2. Row-count query showing 93 total seed records.
3. ER diagram.
4. Frontend create, view, update and delete workflows.
5. Duplicate phone validation and missing required field validation.
6. Foreign-key protected deletion error.
7. Three SQL views and representative JOIN / nested / GROUP BY-HAVING query results.
8. Dashboard and report screens.
