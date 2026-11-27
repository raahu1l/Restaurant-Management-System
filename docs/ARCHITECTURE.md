# System Architecture

```mermaid
flowchart TD
    U[Restaurant Staff / User] --> UI[React + Vite Frontend]
    UI -->|HTTP JSON REST requests| API[Node.js + Express API]
    API -->|mysql2 parameterized SQL| DB[(MySQL 8 Database)]
    DB -->|Rows / aggregate results| API
    API -->|JSON response / error| UI
    UI -->|Render forms, tables, dashboard and reports| U
```

Frontend forms call the REST API. Express routes dispatch to controllers. Controllers validate entity names and permitted columns, execute parameterized SQL through `mysql2`, and return JSON. MySQL enforces primary keys, foreign keys, uniqueness, nullability, defaults and check constraints. A centralized error handler converts common database errors into readable HTTP responses.
