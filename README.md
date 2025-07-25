UCart – E‑Commerce Backend API
A full‑featured e‑commerce backend built with Node.js, Express, MongoDB, and Mongoose.
Provides user authentication, product management, shopping cart with variant support, orders, admin controls, ratings & reviews, nested categories, and dummy payment processing.

🚀 Features
Authentication & Authorization

JWT‑based user signup & login

Role‑based access control (User / Admin)

User Management

View & edit profile

Admin-only user list

Category Management

Multi-level nested categories

Admin can create, update, and delete

Product Catalog

Public product listing & detailed product pages

Admin product creation (with variants)

Variants Support

Variants stored in a separate collection

SKU-based identification with attributes like color, size

Each variant can have separate images, price, and stock

Shopping Cart

Per-user cart linked via JWT

Add/remove/update products by productId and sku

One variant per cart item with quantity

Automatically recalculates totals

Order Management

Convert cart into orders

Basic status lifecycle (confirm, ship, deliver, cancel)

Admin can manage all orders

Ratings & Reviews

Users can rate and review products

View ratings/reviews by product

Admin Utilities

Admin seeding

Protected route enforcement

📁 Project Structure
csharp
Copy
Edit
src/
├── app.js # Express app
├── index.js # Server bootstrap
├── config/ # Database, JWT, Razorpay configs
├── controllers/ # Route logic
├── middleware/ # Auth, role, error middlewares
├── models/ # Mongoose schemas (User, Cart, Product, etc.)
├── routes/ # Express routers
├── services/ # Core business logic
└── scripts/ # CLI scripts (e.g., seed admin)
🔧 Getting Started

1. Prerequisites
   Node.js v18+

MongoDB (local or cloud)

2. Install & Setup
   bash
   Copy
   Edit
   git clone https://github.com/your‑username/ucart-backend.git
   cd ucart-backend
   npm install
3. Environment
   Create a .env file:

env
Copy
Edit
PORT=5454
MONGO*URI=mongodb://localhost:27017/ucart
JWT_SECRET=yourSecretKey
RAZORPAY_KEY_ID=rzp_test*...
RAZORPAY_KEY_SECRET=secret 4. Start Server
bash
Copy
Edit

# dev

npm run dev

# production

npm start
🔐 Authentication
All protected routes require a JWT bearer token:

makefile
Copy
Edit
Authorization: Bearer <your_token>
📦 API Reference
🧑 Auth
Method Endpoint Description
POST /api/auth/signup Register a new user
POST /api/auth/signin Login and get token

👤 Users
Method Endpoint Access Description
GET /api/users/profile User Get own profile
GET /api/users Admin List all users

🗂 Categories
Method Endpoint Access Description
GET /api/categories Public List all categories
POST /api/admin/categories Admin Create category
PUT /api/admin/categories/:id Admin Update category
DELETE /api/admin/categories/:id Admin Delete category

🛍 Products
Method Endpoint Access Description
GET /api/products Public List all products
GET /api/products/:id Public Get product with variants
POST /api/admin/products Admin Create product (with variants)
PUT /api/admin/products/:id Admin Update product & its variants
DELETE /api/admin/products/:id Admin Delete a product

🧬 Variants
Managed as sub-resources of Product

Use sku + attributes (e.g. color, size)

One product can have many variants with separate price/stock/images

🛒 Cart
Method Endpoint Access Description
GET /api/cart User Get current user's cart
PUT /api/cart/add User Add product/variant to cart
PUT /api/cart/:id User Update quantity of a cart item
DELETE /api/cart/:id User Remove a cart item

✅ Cart is per-user and persisted in DB.
Each item includes product ID, selected SKU, quantity, price.

📦 Orders
Method Endpoint Access Description
POST /api/orders User Create order from cart
GET /api/orders/user User View order history
PUT /api/orders/:id/... User Confirm/cancel order

📋 Admin Orders
Method Endpoint Access Description
GET /api/admin/orders Admin View all orders
PUT /api/admin/orders/:id/confirmed Admin Mark as confirmed
PUT /api/admin/orders/:id/ship Admin Mark as shipped
PUT /api/admin/orders/:id/deliver Admin Mark as delivered
PUT /api/admin/orders/:id/cancel Admin Cancel the order
DELETE /api/admin/orders/:id/delete Admin Delete the order

⭐ Ratings & Reviews
Method Endpoint Access Description
POST /api/ratings User Submit rating
GET /api/ratings/product/:productId Public Get ratings for a product
POST /api/reviews User Submit review
GET /api/reviews/product/:productId Public Get reviews for a product

🧪 Postman
Import collection

Sign in → set token via:

js
Copy
Edit
const data = pm.response.json();
pm.environment.set("token", data.token);
Use Bearer {{token}} in Auth tab

👑 Seeding Admin
bash
Copy
Edit
node src/scripts/seedAdmin.js
Or insert manually:

js
Copy
Edit
db.users.insertOne({
name: "Admin",
email: "admin@example.com",
password: "<hashed_pw>",
role: "ADMIN"
});
📜 License
Licensed under MIT — see LICENSE
