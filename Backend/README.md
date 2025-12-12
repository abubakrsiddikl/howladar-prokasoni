# 📘 Howladar Prokasoni Backend

A production-ready, highly scalable, and modular Node.js + TypeScript backend for the Howladar Prokasoni online bookstore. This API serves as the central hub for authentication, product management, order processing, and payment handling.

🔗 **Live API:** [https://howladar-prokasoni-server.vercel.app](https://howladar-prokasoni-server.vercel.app)

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
* [Flow Diagrams](#flow-diagrams)
* [API Routes Overview](#🌐-api-routes-overview)
* [Troubleshooting](#🛠-troubleshooting)
* [License](#📄-license)

---

## 🧾 Introduction

This is a highly scalable and modular backend built using **Node.js, Express.js, and TypeScript**. It is specifically designed for online bookstores, e-commerce platforms, or any product-selling system.

The backend includes critical integrations for a modern e-commerce setup:

* Secure authentication using **Passport.js** and **JWT**.
* **Cloudinary** for image uploads.
* **SSLCommerz** for payment integration.
* **Nodemailer** for sending transactional emails.

## 🧰 Tech Stack

| Category | Technologies |
| :--- | :--- |
| **Backend Core** | Node.js, Express.js, TypeScript |
| **Database** | MongoDB + Mongoose |
| **Authentication** | Passport.js, JWT Authentication |
| **External Services** | Cloudinary (File Upload), SSLCommerz (Payment Gateway), Nodemailer (Email Service) |
| **Utilities** | Zod / Custom Validation, Vercel Deployment |

## 🌟 Features

### 🔐 Authentication & User Management

* Register, Login, Logout functionality.
* Secure Passport.js Local Strategy for custom authentication.
* JWT-secured private routes using Custom Authentication Middleware.
* User Profile management.

### 📚 Product & Catalog Management

* **Book Module:** Full CRUD operations, image upload integration, price, stock, and discount features.
* **Genre Module:** Genre creation and management, used for dynamic filtering and catalog organization.
* **Author Module:** Complete CRUD functionality for author details.
* **Banner Module:** Management of homepage banners with Cloudinary image storage.

### 🛒 E-commerce & Order Flow

* **Cart Module:** Functionality for Add to Cart, Remove cart items, and fetching the user's active cart.
* **Order Module:** Order creation, status tracking, and detailed order logs.
* **Payment (SSLCommerz):** Payment initialization, handling of Success/Fail/Cancel redirects, and transaction verification.

### ☁️ Integrations

* **Cloudinary Upload:** Secure and auto-optimized file upload system.
* **Email Service (Nodemailer):** Used for order confirmation and notifications via custom SMTP support.

---

## 📁 Project Structure

The project follows a standard modular architecture where each service/feature is isolated in its own folder under `src/app/module/`.