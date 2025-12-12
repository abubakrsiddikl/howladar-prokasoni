# 📘 Howladar Prokasoni Backend

A production-ready Node.js + TypeScript backend for the Howladar Prokasoni online bookstore.
This backend includes authentication, book/product management, order system, cart, authors, genres, banners, email service, payment gateway (SSLCommerz), Cloudinary upload, stats, and more.

🔗 **Live API:** [https://howladar-prokasoni-server.vercel.app](https://howladar-prokasoni-server.vercel.app)

---

## 📑 Table of Contents

* Introduction
* Tech Stack
* Features
* Project Structure
* Installation
* Environment Variables
* Running the Project
* Available Modules
* Authentication Flow
* File Upload System
* Payment Integration
* Email Service
* API Routes Overview
* Troubleshooting
* License

---

## 🧾 Introduction

This is a highly scalable and modular backend built using **Node.js**, **Express.js**, and **TypeScript**.
It is designed for online bookstores, e-commerce platforms, or any product-selling system.

The backend includes:

* Secure authentication using Passport.js
* Cloudinary for image uploads
* SSLCommerz for payment integration
* Nodemailer for sending emails
* Modular architecture with reusable components

---

## 🧰 Tech Stack

* Node.js + Express.js
* TypeScript
* MongoDB + Mongoose
* Passport.js
* JWT Authentication
* Cloudinary
* SSLCommerz Payment Gateway
* Nodemailer
* Zod / Custom Validation
* Vercel Deployment

---

## 🌟 Features

### 🔐 Authentication & User Management

* Register, Login, Logout
* Passport.js Local Strategy
* JWT-secured private routes
* Profile management

### 👤 Author Module

* Create, update, delete authors
* Get author details & list

### 📚 Book Module

* Full CRUD
* Genre & Author reference
* Image upload
* Price, stock, discount features

### 🏷 Genre Module

* Create & manage genres
* Use for book filtering

### 🛒 Cart Module

* Add to cart
* Remove items
* Fetch user cart

### 🎨 Banner Module

* Admin can upload homepage banners
* Cloudinary image storage

### 🛍 Order Module

* Order creation
* Tracking
* Order details

### 💳 Payment (SSLCommerz)

* Payment initialization
* Success/Fail/Cancel handlers
* Transaction verification

### ☁ Cloudinary Upload

* Secure file upload
* Auto-optimized URL

### 📧 Email Service (Nodemailer)

* Notifications
* Order confirmation
* Custom SMTP support

---

## 📁 Project Structure

```
src/
 ├── app/
 │   ├── config/
 │   ├── errorHelper/
 │   ├── middleware/
 │   ├── module/
 │   │   ├── auth/
 │   │   ├── author/
 │   │   ├── banner/
 │   │   ├── book/
 │   │   ├── cart/
 │   │   ├── genre/
 │   │   ├── order/
 │   │   ├── payment/   <-- SSLCommerz
 │   │   ├── sitemap/
 │   │   ├── stats/
 │   │   └── user/
 │   └── routes/
 ├── types/
 └── server.ts
```

---

## 🛠️ Installation

### 1️⃣ Clone the repository

```
git clone https://github.com/your-username/howladar-prokasoni-backend.git
cd howladar-prokasoni-backend
```

### 2️⃣ Install dependencies

```
npm install
```

---

## 🔐 Environment Variables

Create a `.env` file:

```
PORT=5000
MONGO_URI=your_mongodb_uri

# Cloudinary
CLOUDINARY_CLOUD_NAME=xxxx
CLOUDINARY_API_KEY=xxxx
CLOUDINARY_API_SECRET=xxxx

# JWT
JWT_SECRET=xxxx

# SSLCommerz
STORE_ID=xxxx
STORE_PASSWORD=xxxx
SUCCESS_URL=https://yourdomain.com/payment/success
FAIL_URL=https://yourdomain.com/payment/fail
CANCEL_URL=https://yourdomain.com/payment/cancel

# Nodemailer
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email@example.com
EMAIL_PASS=xxxx
```

---

## ▶ Running the Project

### Development

```
npm run dev
```

### Production

```
npm run build
npm start
```

---

## 📦 Available Modules

| Module  | Description                       |
| ------- | --------------------------------- |
| Auth    | Login, Logout, Register, JWT auth |
| User    | User profile management           |
| Author  | Create/update/delete authors      |
| Book    | CRUD + search/filter              |
| Genre   | Category system                   |
| Banner  | Homepage banners                  |
| Cart    | Add/remove cart items             |
| Order   | Order creation & tracking         |
| Payment | SSLCommerz integration            |
| Stats   | Analytics endpoints               |
| Sitemap | Dynamic sitemap                   |

---

## 🔐 Authentication Flow

1. User registers
2. User logs in via Passport.js Local Strategy
3. Server issues JWT
4. Protected routes validate JWT
5. Sensitive operations secured

---

## ☁ File Upload System

* Cloudinary integration
* Auto-resize
* Secure URL stored in DB

---

## 💳 Payment Integration (SSLCommerz)

1. User initiates payment
2. Redirect to SSLCommerz
3. On success → order confirmed
4. On fail → order canceled
5. On cancel → order marked canceled

---

## 📧 Email Service (Nodemailer)

Used for:

* Order confirmation
* Notifications
* Custom SMTP support

---

## 🌐 API Routes Overview

Example:

```
POST /api/auth/register
POST /api/auth/login
GET  /api/books
POST /api/order
POST /api/payment/init
```

---

## 🛠 Troubleshooting

| Issue                  | Solution                   |
| ---------------------- | -------------------------- |
| MongoDB not connecting | Check MONGO_URI            |
| Cloudinary error       | Verify API keys            |
| SSLCommerz 400         | Store ID/Password mismatch |
| Email not sending      | Enable SMTP/App Password   |

---

## 📄 License

This project is licensed under the **MIT License**.
