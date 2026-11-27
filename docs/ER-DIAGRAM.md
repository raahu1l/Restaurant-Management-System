# Entity Relationship Diagram

```mermaid
erDiagram
    CUSTOMERS ||--o{ ORDERS : places
    RESTAURANT_TABLES ||--o{ ORDERS : assigned_to
    STAFF ||--o{ ORDERS : handles
    ORDERS ||--|{ ORDER_ITEMS : contains
    MENU_ITEMS ||--o{ ORDER_ITEMS : appears_in
    ORDERS ||--o| BILLS : generates
    BILLS ||--o{ PAYMENTS : receives

    CUSTOMERS {
      int customer_id PK
      varchar name
      char phone UK
      varchar email
      int loyalty_points
    }
    MENU_ITEMS {
      int item_id PK
      varchar name UK
      varchar category
      decimal price
      boolean is_available
    }
    RESTAURANT_TABLES {
      int table_id PK
      int table_number UK
      int capacity
      varchar status
    }
    STAFF {
      int staff_id PK
      varchar name
      varchar role
      char phone UK
      decimal salary
      date hire_date
    }
    ORDERS {
      int order_id PK
      int customer_id FK
      int table_id FK
      int staff_id FK
      date order_date
      varchar status
    }
    ORDER_ITEMS {
      int order_item_id PK
      int order_id FK
      int item_id FK
      int quantity
    }
    BILLS {
      int bill_id PK
      int order_id FK,UK
      date bill_date
      decimal subtotal
      decimal tax
      decimal total
      varchar status
    }
    PAYMENTS {
      int payment_id PK
      int bill_id FK
      decimal amount
      varchar method
      date payment_date
    }
```

Notes: Customer is optional on an order for walk-in transactions. An order may have zero or one bill. A bill may have multiple payment records (e.g. split payments). Every order has one or more order-item lines in the intended business workflow; the database FK ensures each line references an existing order and menu item.
