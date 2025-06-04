# 🐾 PetPaw – Fullstack Pet Shop Web Application

**PetPaw** is a modern fullstack pet shop platform built with Vue 3 + Pinia on the frontend and Bun + Elysia + JWT on the backend. The app supports user authentication, product browsing, shopping cart, order placement, and admin management functionality.

---

## Features

### User
- Sign up / Sign in with cookie-based authentication
- Browse products by category
- View product details
- Add items to cart
- Checkout and view orders

### Admin
- Admin dashboard
- Manage users
- Manage products (CRUD)
- View orders

### Authentication
- JWT-based auth stored in cookie
- Pinia state persisted with secure logout
- Role-based route protection (`user` vs `admin`)

---

## Tech Stack

| Layer         | Tech Used                        |
|---------------|----------------------------------|
| Frontend      | Vue 3, Pinia, Vue Router, Tailwind CSS |
| Backend       | Bun, Elysia, JWT                 |
| State         | Pinia |
| Auth          | Cookie-based JWT (access_token) |
| Database      | PostgreSQL, PrismaORM |

