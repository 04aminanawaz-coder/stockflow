# StockFlow — Full-Stack Inventory Manager

A full-stack CRUD application for managing product inventory, built with **React + Tailwind CSS** on the frontend and **Node.js + Express + MongoDB (Mongoose)** on the backend.

Live demo: https://stockflow-xf3m.onrender.com

## Features

- Full CRUD: create, read, update, and delete products
- MongoDB schema with validation: required fields, enum categories, min values, integer checks
- Search (case-insensitive regex), category filter, stock-status filter, and sorting via query params
- Stats dashboard computed with a MongoDB **aggregation pipeline**: total products, units in stock, inventory value, low-stock count, per-category totals
- Computed Mongoose virtuals: `stockValue` and `stockStatus` (in stock / low / out)
- Centralized Express error handling: `CastError`, `ValidationError`, and duplicate-key errors all return clean JSON
- Debounced search + loading/empty/error states on the frontend
- Production mode: Express serves the built React app as a single deployable service

## Tech Stack

| Layer     | Technology                                  |
| --------- | ------------------------------------------- |
| Frontend  | React 18, Vite, Tailwind CSS                |
| Backend   | Node.js, Express.js                         |
| Database  | MongoDB, Mongoose ODM                       |
| Deploy    | Render (API + static client) or Vercel/Render split |

## Project Structure

```
stockflow/
├── client/                  # React + Vite + Tailwind frontend
│   └── src/
│       ├── api/products.js  # Fetch wrapper for the REST API
│       ├── components/      # StatsBar, FilterBar, ProductList, ProductForm
│       └── App.jsx
└── server/                  # Express + Mongoose REST API
    └── src/
        ├── config/db.js     # MongoDB connection
        ├── models/          # Product schema (validation, indexes, virtuals)
        ├── routes/          # CRUD + /stats aggregation endpoint
        ├── middleware/      # Centralized error handling
        ├── seed.js          # Sample data seeder
        └── server.js
```

## API Reference

| Method | Endpoint             | Description                                        |
| ------ | -------------------- | -------------------------------------------------- |
| GET    | `/api/health`        | Health check                                       |
| GET    | `/api/products`      | List products. Query: `search`, `category`, `stock`, `sort` |
| GET    | `/api/products/stats`| Aggregated stats (totals, value, low stock, by category) |
| GET    | `/api/products/:id`  | Single product                                     |
| POST   | `/api/products`      | Create product (validated)                         |
| PUT    | `/api/products/:id`  | Update product (re-validated)                      |
| DELETE | `/api/products/:id`  | Delete product                                     |

## Local Setup

### 1. Get a MongoDB connection string

Easiest: free [MongoDB Atlas](https://www.mongodb.com/atlas) cluster:
1. Create an account → build a free M0 cluster
2. Database Access → add a user (username + password)
3. Network Access → allow your IP (or `0.0.0.0/0` for development)
4. Connect → Drivers → copy the URI: `mongodb+srv://<user>:<pass>@cluster0.xxxxx.mongodb.net/stockflow`

Or use a local MongoDB: `mongodb://127.0.0.1:27017/stockflow`

### 2. Configure and run the server

```bash
cd server
cp .env.example .env        # then paste your MONGODB_URI into .env
npm install
npm run seed                # optional: inserts 8 sample products
npm run dev
```

API is now on `http://localhost:5000`.

### 3. Run the client

```bash
cd client
npm install
npm run dev
```

App is now on `http://localhost:5173` (Vite proxies `/api` to the server).

## Deployment (single service on Render)

1. Push this repo to GitHub
2. Render → New Web Service → connect the repo
3. Build Command: `npm install --prefix server && npm install --prefix client && npm run build --prefix client`
4. Start Command: `node server/src/server.js`
5. Environment variables: `NODE_ENV=production`, `MONGODB_URI=<your atlas uri>`

Split deployment also works: server on Render (Root Directory: `server`), client on Vercel with `VITE_API_URL=https://<your-api>.onrender.com/api`.

## Interview Talking Points

- **Schema design**: why `enum` for categories, why `min`/integer validation lives in the schema, how validation runs again on update via `runValidators`
- **Indexes**: `name` and `category` indexed for the filter/search paths
- **Aggregation pipeline**: `$group` → `$sum` → `$cond` → `$round` for the stats endpoint, instead of computing totals in JS
- **Virtuals**: `stockValue`/`stockStatus` derived on read, not stored (no data duplication)
- **Error handling**: one middleware maps Mongoose `CastError`/`ValidationError` to proper HTTP 400s so the frontend always gets predictable JSON
- **REST design**: correct status codes (201 create, 400 validation, 404 missing), query-param filtering/sorting, resource naming

## Security Notes

- `.env` is git-ignored — never commit database credentials
- All origins are allowed via CORS for development; restrict it to your deployed domain in production
