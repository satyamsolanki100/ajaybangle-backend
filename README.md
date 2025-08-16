# Ajay Bangle Backend (Node.js + Express + MongoDB)

Implements your e-commerce backend per the instructions:
- Products API (filters/search/sort/pagination)
- Orders API (guest checkout, status updates)
- Razorpay integration (create order + verify signature)
- COD support
- Admin endpoints (CRUD products, list orders, revenue, simple reports)
- Email notifications (customer + admin)
- Security (helmet, CORS), performance (compression)
- CSV export for orders

## 1) Setup

```bash
# 1. Unzip
cd ajay-bangle-backend

# 2. Install deps
npm install

# 3. Configure env
cp .env.example .env
# Fill MONGO_URI, JWT_SECRET, Razorpay keys, SMTP creds
```

## 2) Run locally

```bash
npm run dev
# API at http://localhost:5000
```

Health check: `GET /api/health`

## 3) Seed demo data

```bash
npm run seed
```

Creates an admin:
- email: `admin@ajaybangle.com`
- password: `admin123`

## 4) Key API endpoints

### Products
- `GET /api/products` – list (supports `keyword, category, minPrice, maxPrice, sort, page, limit`)
- `GET /api/products/:idOrSlug` – details
- `POST /api/products` (admin) – create
- `PUT /api/products/:id` (admin) – update
- `DELETE /api/products/:id` (admin) – delete

### Orders
- `POST /api/orders` – create (guest allowed)
- `GET /api/orders/:id` – view order

### Payments (Razorpay)
- `POST /api/payments/create-order` – returns Razorpay order object (send amount in INR)
- `POST /api/payments/verify` – verifies signature & marks order paid

### Users (Admin auth)
- `POST /api/users/register` – create admin
- `POST /api/users/login` – get JWT token

### Admin
- `GET /api/admin/orders` – list orders + revenue
- `PUT /api/admin/orders/:id/status` – update status
- `GET /api/admin/reports/products` – counts by category

### Export Orders (CSV)
```bash
npm run export:orders
# outputs orders_export.csv
```

## 5) Connect Frontend

In your frontend:
- Shop page → fetch `GET /api/products`
- Product details → `GET /api/products/:slug`
- Checkout flow:
  1. Create order in your DB: `POST /api/orders`
  2. For Razorpay: call `POST /api/payments/create-order` with amount
  3. Open Razorpay checkout on the client; on success, call `POST /api/payments/verify` with razorpay ids + your orderId

Set CORS origin via `CLIENT_ORIGIN` in `.env` (e.g., your Netlify URL).

## 6) Deploy (free options)

- **Render** (free tier):
  - New Web Service → Node → link repo
  - Build: `npm install`
  - Start: `npm start`
  - Add env vars from `.env`
- **Railway** / **Fly.io** similar steps.

## 7) Notes

- Emails require valid SMTP credentials (e.g., Gmail App Password).
- Razorpay requires real keys to work in test/live mode.
- This project is intentionally minimal (no file uploads from admin UI); you can extend easily.
