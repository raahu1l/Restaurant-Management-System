# Normalization Proof (up to Third Normal Form)

## First Normal Form (1NF)
All tables have a primary key and each field stores one atomic value. Repeating menu items are not stored as comma-separated values inside `orders`; each ordered menu item is represented as a separate row in `order_items`. There are no repeating groups or multivalued columns.

## Second Normal Form (2NF)
The schema uses single-column surrogate primary keys (`customer_id`, `item_id`, etc.). Therefore, every non-key attribute is dependent on the whole primary key; there are no partial dependencies on part of a composite key. In `order_items`, the order, menu item and quantity are stored in the line-item relation rather than repeated as multiple columns in an order row.

## Third Normal Form (3NF)
Non-key attributes describe only the entity identified by that table's primary key. Customer contact details are stored only in `customers`; menu descriptions and current prices are stored only in `menu_items`; employee details are stored only in `staff`; table capacity/status is stored only in `restaurant_tables`. Orders reference these entities through foreign keys rather than duplicating their descriptive attributes. Bill/payment data is separated from order and order-item data. Payment method and payment amount are stored per payment transaction. Thus there are no non-key attributes transitively dependent on another non-key attribute in the respective relations.

`bills.total` is retained as an issued invoice amount/snapshot because it is part of the frontend's billing record. Order item line totals and payment balances are calculated in SQL views rather than redundantly stored in base tables.

## Referential integrity
Foreign keys connect each child row to an existing parent. `ON DELETE RESTRICT` protects historical orders, order lines, bills and payments from accidental parent deletion; `ON UPDATE CASCADE` propagates a changed referenced key. `bills.order_id` is UNIQUE to enforce at most one bill per order.
