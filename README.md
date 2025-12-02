# 💬 Real-Time Chat Application (MERN + Socket.io)

A fully functional **real-time chat application** built with the **MERN stack**, featuring secure authentication, instant messaging, online presence, media uploads, rate-limiting, email notifications, and a polished UI.

This project showcases my ability to build **production-ready full-stack applications** using modern technologies like **React**, **Node.js**, **Socket.io**, **MongoDB**, and **Cloudinary**, along with strong focus on scalability, security, and developer workflow.

---

## ✨ Features

### 🔐 Authentication & Security
- Custom **JWT Authentication** (no third-party auth providers)
- Access & Refresh Token Flow
- Secure password hashing with bcrypt
- Protected routes (Frontend + Backend)
- CORS protection and API rate-limiting (Arcjet)

### ⚡ Real-Time Chat System
- Instant messaging with **Socket.io**
- **Online/Offline** user presence tracking
- Sound notifications (toggle available)

### 🗂️ Media & File Handling
- Image uploads using **Cloudinary**
- Supports profile pictures & chat media

### 🔔 Notifications & Email System
- Welcome email sent on signup using **Resend**
- In-app sound notifications
- Toggle for enabling/disabling sound

### 🎨 Frontend (React + Tailwind + DaisyUI)
- Modern responsive UI
- Chat bubbles, message groups, timestamp formatting
- Zustand for global state management
- Clean reusable components

### 🧱 Backend (Node.js + Express)
- Modular MVC folder structure
- Separate routes, controllers, middlewares, services
- User, Message MongoDB models
- Implemented REST API

### 🧰 Additional Developer Features
- Git branching workflow (PRs, merges, commits)
- Environment-based config system
- Error handling middleware

### 🚀 Deployment
- Frontend & Backend easily deployable (free-tier compatible)
- Environment variables for both sides

---

## 🛠️ Tech Stack

### **Frontend**
- React.js
- Zustand
- Tailwind CSS + DaisyUI
- Axios
- React Router

### **Backend**
- Node.js
- Express.js
- MongoDB + Mongoose
- Socket.io
- Cloudinary SDK
- JSON Web Tokens
- Arcjet (Rate limiting)
- Resend (Emails)

---

## 🚀 Getting Started (Local Setup)

### 1️⃣ Clone the Repository
```bash
git clone https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git
cd YOUR_REPO_NAME
```

2️⃣ Install Dependencies
```bash
cd backend && npm install
cd ../frontend && npm install
```

3️⃣ Set Environment Variables

Create .env files:

-MONGO_URI=your_mongodb_url
-JWT_SECRET=your_jwt_secret
-CLOUDINARY_CLOUD_NAME=
-CLOUDINARY_API_KEY=
-CLOUDINARY_API_SECRET=
-RESEND_API_KEY=
-ARCJET_KEY=
-CLIENT_URL=http://localhost:5173

4️⃣ Start the App

Backend:
```bash
npm run dev
```

Frontend:
```bash
npm run dev
```

