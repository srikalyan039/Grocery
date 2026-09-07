# MERN Grocery App

A full-stack grocery e-commerce web application featuring user authentication, product management, dynamic unit pricing, and persistent cart handling.

## Tech Stack

- **Frontend:** React, Vite, Tailwind CSS, Zustand, Axios, React Router
- **Backend:** Node.js, Express.js, Mongoose, Multer, Nodemailer
- **Database:** MongoDB Atlas

## Features

- **Product Browsing & Filtering:** Filter by categories (Fruits, Vegetables, Meat, Food Grains) and search in real-time.
- **Dynamic Pricing:** Support for unit-based purchasing (e.g., 500g, 1kg, 2kg, 5kg) with instant price calculations.
- **Persistent Cart:** Fully synchronized user carts connected to MongoDB.
- **Authentication:** Email-based OTP verification and secure JWT sessions.
- **Admin Management:** Add new grocery items with image uploads and category assignments.

## Setup Instructions

```bash
cd backend
npm install
npm start


cd frontend
npm install
npm run dev
