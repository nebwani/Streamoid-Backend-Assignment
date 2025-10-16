# Streamoid Backend Assignment

This repository contains a small Express + Sequelize backend for managing products. It exposes endpoints to upload product data via CSV, list products, and search/filter products.

Contents
- Source: `src/` (Express app, controllers, routes, models)
- Sample CSV: `product_example.csv`
- Uploads folder: `uploads/`

## Quick overview

- Language: Node.js (ES modules)
- Framework: Express
- ORM: Sequelize (Postgres dialect)
- CSV parsing: `csv-parser`


## Prerequisites

- Node.js (v14+ recommended)
- npm
- PostgreSQL database


## Environment variables

Create a `.env` file in the project root with the following variables:

```
DB_NAME=your_database_name
DB_USER=your_db_user
DB_PASS=your_db_password
DB_HOST=localhost
DB_PORT=5432
PORT=8000
```

Notes:
- The app uses Sequelize to connect to Postgres. Make sure the database and user exist and the credentials are correct.


## Install & run (development)

Open a terminal in the project root and run:

```cmd
npm install
npm run dev
```

The development script runs `nodemon` and loads environment variables.


## Database

Before running the app ensure Postgres is running and the database specified by `DB_NAME` exists. The server will run `sequelize.sync({ alter: true })` on startup to create/alter tables.


## API Documentation

Base URL: http://localhost:8000/api/v1

All successful responses use the project `ApiResponse` shape:

```json
{
  "statusCode": 200,
  "data": { /* payload */ },
  "message": "Success message",
  "success": true
}
```

Errors handled by the app return at minimum:

```json
{
  "success": false,
  "message": "Error message"
}
```


### 1) Upload products (CSV)

- Endpoint: POST `/upload`
- Description: Accepts a CSV file (field name `file`) and stores valid rows into the `Products` table. Invalid rows are returned in the response with error messages. Duplicate `sku` values are ignored when inserting (unique constraint on SKU).
- Request: multipart/form-data with one file field named `file`.

Sample curl (from project root, uploads the provided sample CSV):

```cmd
curl -X POST "http://localhost:8000/api/v1/upload" -F "file=@product_example.csv"
```

Successful response example:

```json
{
  "statusCode": 200,
  "data": {
    "stored": 12,
    "failedRows": [
      {
        "row": { "sku": "X1", "name": "Bad Item", "price": "150", "mrp": "100" },
        "error": "Price cannot exceed MRP"
      }
    ]
  },
  "message": "Success",
  "success": true
}
```

Validation rules applied during upload (implemented in `src/controllers/product.controller.js`):
- Required: `sku`, `name`, `brand`, `mrp`, `price`
- `price` must not exceed `mrp`
- `quantity` must be >= 0


### 2) List products

- Endpoint: GET `/products`
- Description: Returns products. Supports pagination using `page` and `limit` query parameters.
- Query params:
  - `page` (optional) - page number (1-based)
  - `limit` (optional) - number of items per page

Examples:

Request (get first page, 10 per page):

```cmd
curl "http://localhost:8000/api/v1/products?page=1&limit=10"
```

Response example:

```json
{
  "statusCode": 200,
  "data": [
    {
      "sku": "SKU123",
      "name": "T-Shirt",
      "brand": "Acme",
      "color": "Blue",
      "size": "M",
      "mrp": 29.99,
      "price": 19.99,
      "quantity": 10
    }
  ],
  "message": "Products fetched successfully",
  "success": true
}
```


### 3) Search / filter products

- Endpoint: GET `/products/search`
- Description: Filter products by `brand`, `color`, and price range (`minPrice`, `maxPrice`). All filters are optional and combined with AND logic.
- Query params:
  - `brand` (optional)
  - `color` (optional)
  - `minPrice` (optional)
  - `maxPrice` (optional)

Example request:

```cmd
curl "http://localhost:8000/api/v1/products/search?brand=Acme&color=Blue&minPrice=10&maxPrice=50"
```

Response example:

```json
{
  "statusCode": 200,
  "data": [
    {
      "sku": "SKU123",
      "name": "T-Shirt",
      "brand": "Acme",
      "color": "Blue",
      "size": "M",
      "mrp": 29.99,
      "price": 19.99,
      "quantity": 10
    }
  ],
  "message": "Filtered products fetched successfully!",
  "success": true
}
```


## Testing manually (Postman / curl)

- Upload the sample CSV or your own CSV using the `POST /api/v1/upload` endpoint. Check the response for `stored` and `failedRows`.
- List products with `GET /api/v1/products` and exercise pagination.
- Filter products with `GET /api/v1/products/search`.

Tips:
- If you run into DB connection errors, re-check `.env` values and that Postgres accepts connections from your host. The app logs connection errors on startup.
- The app will remove uploaded CSV files after processing.


## Notes & next steps

- There are no automated tests included. A recommended improvement is to add a few unit/integration tests (e.g., using Jest + Supertest) for the upload parsing and search endpoints.
- Add rate limiting and authentication for production use.


## Project structure (important files)

- `src/index.js` — server bootstrap and DB sync
- `src/app.js` — Express app
- `src/routes/product.routes.js` — API routes
- `src/controllers/product.controller.js` — upload, list, search logic
- `src/models/product.model.js` — Sequelize product model
- `src/db/db.js` — Sequelize/Postgres connection


## Author

Lakshya Nebwani
