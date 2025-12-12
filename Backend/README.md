# 📘 Howladar Book Store (Backend API)

A production-ready, highly scalable, and modular backend service built with Node.js, Express.js, and TypeScript, designed specifically for the Howladar Prokasoni online bookstore e-commerce platform.

This API provides secure authentication, comprehensive product catalog management, a robust order system, integrated payment processing (SSLCommerz), and utilities for file storage (Cloudinary) and email notifications (Nodemailer).

---

## 🔗 Live API Endpoint

The latest stable version of the API is deployed on Vercel and accessible here:

👉 **[https://howladar-prokasoni-server.vercel.app](https://howladar-prokasoni-server.vercel.app)**

---

## 📑 Table of Contents

* [Introduction](#🧾-introduction)
* [Tech Stack](#🧰-tech-stack)
* [Features](#🌟-features)
* [Project Structure](#📁-project-structure)
* [Installation](#🛠️-installation)
* [Environment Variables](#🔐-environment-variables)
* [Running the Project](#▶-running-the-project)
* [Available Modules](#📦-available-modules)
* [Architecture Deep Dive](#architecture-deep-dive)
    * [Authentication Flow](#🔐-authentication-flow)
    * [Payment Integration (SSLCommerz)](#💳-payment-integration-sslcommerz)
    * [File Upload System (Cloudinary)](#☁-file-upload-system)
* [License](#📄-license)

---

## 🧾 Introduction

This backend is built on a modular architecture to ensure maximum reusability and maintainability. It is suitable for any modern e-commerce or product-selling system requiring secure and fast data handling.

## 🧰 Tech Stack

* **Runtime:** Node.js + Express.js
* **Language:** TypeScript
* **Database:** MongoDB + Mongoose (ODM)
* **Authentication:** Passport.js (Local Strategy) & JWT
* **Validation:** Zod / Custom Validation
* **File Storage:** Cloudinary
* **Payment Gateway:** SSLCommerz
* **Email Service:** Nodemailer
* **Deployment:** Vercel

## 🌟 Features

### 🔐 Authentication & User Management

* Register, Login, and Logout functionality.
* Secure authentication using Passport.js Local Strategy.
* JWT-secured private routes for all authenticated operations.
* User profile management.

### 📚 Product & Catalog Management

| Module | Description | Key Capabilities |
| :--- | :--- | :--- |
| **Book** | Core product data and inventory. | Full CRUD, integration with Genre/Author, image upload, price/stock/discount features. |
| **Genre** | Category management. | CRUD, used for dynamic product filtering and fetching genres sorted by book count. |
| **Author** | Author details management. | Create, update, delete, and list author details. |
| **Banner** | Management of promotional content. | Admin-controlled uploads for homepage banners (stored on Cloudinary). |

### 🛒 E-commerce & Order System

* **Cart Module:** Add, remove, fetch, and update cart items.
* **Order Module:** Order creation, secure order tracking, and order status updates.
* **Payment Gateway (SSLCommerz):** Seamless integration for payment initiation, success, fail, and cancel handlers.

---

## 📁 Project Structure

The project adheres to a clean, modular structure, isolating business logic by feature:

src/├── app/│   ├── config/             // Environment configuration│   ├── errorHelper/        // Custom error handling│   ├── middleware/         // JWT verification, validation, etc.│   ├── module/             // Main feature modules (Auth, Book, Payment, etc.)│   │   ├── auth/│   │   ├── author/│   │   ├── banner/│   │   ├── book/│   │   ├── cart/│   │   ├── genre/│   │   ├── order/│   │   ├── payment/        <-- SSLCommerz integration logic│   │   ├── sitemap/│   │   ├── stats/│   │   └── user/│   └── routes/             // Centralized route registration├── types/                  // Global TypeScript interfaces└── server.ts               // Application entry point
## 🛠️ Installation

### 1️⃣ Clone the repository

```bash
git clone [https://github.com/your-username/howladar-prokasoni-backend.git](https://github.com/your-username/howladar-prokasoni-backend.git)
cd howladar-prokasoni-backend
2️⃣ Install dependenciesBashnpm install
🔐 Environment VariablesCreate a .env file in the root directory to configure the application services:Code snippetPORT=5000
MONGO_URI=your_mongodb_uri

# Cloudinary Credentials
CLOUDINARY_CLOUD_NAME=xxxx
CLOUDINARY_API_KEY=xxxx
CLOUDINARY_API_SECRET=xxxx

# JWT Authentication
JWT_SECRET=xxxx

# SSLCommerz Configuration
STORE_ID=xxxx
STORE_PASSWORD=xxxx
SUCCESS_URL=[https://yourdomain.com/payment/success](https://yourdomain.com/payment/success)
FAIL_URL=[https://yourdomain.com/payment/fail](https://yourdomain.com/payment/fail)
CANCEL_URL=[https://yourdomain.com/payment/cancel](https://yourdomain.com/payment/cancel)

# Nodemailer SMTP Configuration
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email@example.com
EMAIL_PASS=xxxx
▶ Running the ProjectDevelopment (with Hot Reload)Bashnpm run dev
Production Build & StartBashnpm run build
npm start
📦 Available ModulesModuleDescriptionAuthHandles User registration, login, and JWT token issuance.UserUser profile and system role management.AuthorManagement of author metadata.BookCore CRUD for the book catalog, search, and filtering.GenreCategorization and sorting endpoints.BannerUpload and serving of homepage promotional banners.CartHandles user-specific shopping cart logic.OrderOrder creation, status updates, and tracking.PaymentSSLCommerz payment initiation and IPN/Validation endpoints.StatsProvides analytics endpoints (e.g., total sales, book counts).SitemapGenerates dynamic sitemaps for SEO.Architecture Deep Dive🔐 Authentication FlowThe system employs a custom JWT-based authentication strategy using Passport.js.User registers/logs in.Passport.js verifies credentials.The Server issues a JWT (JSON Web Token).The token is secured (often via HttpOnly cookies) for client-server communication.All protected routes use custom middleware (checkAuth) to validate the JWT before granting access.💳 Payment Integration (SSLCommerz)The payment module facilitates secure online transactions:Payment Init: The user creates an order, and the system sends the transaction data to SSLCommerz.Redirection: The user is redirected to the SSLCommerz payment gateway.Webhook Handling: SSLCommerz sends callbacks to the configured SUCCESS_URL, FAIL_URL, and CANCEL_URL.Transaction Logic: The API handles the success callback by atomically updating the order's payment status to PAID, changing the order status to Approved, and clearing the user's shopping cart to ensure data consistency.☁ File Upload System (Cloudinary)Images (for Books and Banners) are processed and uploaded to Cloudinary.The system stores the secure, auto-optimized URL from Cloudinary in the MongoDB database.This approach reduces server load and ensures fast image delivery globally.🌐 API Routes OverviewThe API endpoints follow the /api/<module-name>/<action> convention.MethodRouteDescriptionPOST/api/auth/registerRegisters a new user.POST/api/auth/loginAuthenticates a user and returns a JWT.GET/api/booksFetches a list of all books (with search/filter).POST/api/orderCreates a new order.POST/api/payment/initInitiates the SSLCommerz payment process.GET/api/genre/sortedFetches genres, sorted by the number of associated books.POST/api/book/createCreates a new book (requires authentication/role).🛠 TroubleshootingIssueSolutionMongoDB not connectingVerify your MONGO_URI is correct and your server's IP is whitelisted on MongoDB Atlas.Cloudinary errorDouble-check CLOUDINARY_API_KEY and CLOUDINARY_API_SECRET in the .env file.SSLCommerz error 400Confirm STORE_ID and STORE_PASSWORD are correct and the host is set to the correct environment (sandbox/live).Email not sendingEnsure the EMAIL_USER and EMAIL_PASS (usually an App Password for Gmail) are correct and that SMTP access is enabled.📄 LicenseThis project is licensed under the MIT License.