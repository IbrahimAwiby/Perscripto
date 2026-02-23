# 🏥 Prescripto - Healthcare Management Platform

A comprehensive healthcare management solution connecting patients, doctors, and administrators through a seamless digital experience.

![Prescripto Banner](https://res.cloudinary.com/dh7uptai7/image/upload/v1234567890/prescripto-banner.png)

---

## 📋 Table of Contents

- [Overview](#-overview)
- [Key Features](#-key-features)
- [Technology Stack](#-technology-stack)
- [Installation](#-installation)
- [Environment Variables](#-environment-variables)
- [API Documentation](#-api-documentation)
- [Project Structure](#-project-structure)
- [License](#-license)

---

## 🎯 Overview

**Prescripto** is a full-stack healthcare management platform with three integrated interfaces:

- 👤 Patient Portal  
- 👨‍⚕️ Doctor Panel  
- 🔧 Admin Panel  

---

## ✨ Key Features

### 👤 Patient Portal
- Doctor discovery
- Appointment booking
- Appointment management
- Secure messaging
- Online payments (Paymob)
- Profile management
- Appointment history

### 👨‍⚕️ Doctor Panel
- Dashboard analytics
- Appointment management
- Patient records access
- Schedule management
- Profile management
- Performance tracking

### 🔧 Admin Panel
- Platform analytics
- Doctor management
- Appointment oversight
- Revenue tracking
- User management

---

## 🚀 Technology Stack

### Frontend
- React 19
- React Router DOM
- Tailwind CSS
- Axios
- Vite

### Backend
- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT
- Bcrypt
- Cloudinary
- Paymob

---

## 💻 Installation

### 1️⃣ Clone Repository

```bash
git clone https://github.com/IbrahimAwiby/Prescripto.git
cd Prescripto
2️⃣ Install Backend
cd server
npm install
3️⃣ Install Frontend
cd ../client
npm install
🔑 Environment Variables
Backend .env
PORT=5000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key

CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

PAYMOB_API_KEY=your_paymob_key
PAYMOB_INTEGRATION_ID=your_integration_id
PAYMOB_IFRAME_ID=your_iframe_id
PAYMOB_HMAC_SECRET=your_hmac_secret

FRONTEND_URL=http://localhost:5173
Frontend .env
VITE_BACKEND_URL=http://localhost:5000
▶️ Run Application
Backend
cd server
npm run dev
Frontend
cd client
npm run dev
📡 API Routes
Public

POST /api/user/register

POST /api/user/login

GET /api/doctor/list

POST /api/message/send

User

GET /api/user/profile

PUT /api/user/update-profile

POST /api/user/book-appointment

GET /api/user/my-appointments

Admin

POST /api/admin/login

GET /api/admin/doctors-list

POST /api/admin/add-doctor

GET /api/admin/dashboard/stats

Doctor

POST /api/doctor/login

GET /api/doctor/profile

GET /api/doctor/appointments

📁 Project Structure
prescripto/
├── server/
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   ├── middleware/
│   ├── config/
│   └── server.js
└── client/
    ├── public/
    └── src/
📄 License

MIT License © 2024 Prescripto

⭐ If you like this project, give it a star on GitHub!


---

# 🔥 مهم جدًا

بعد ما تحط الملف:

```bash
git add README.md
git commit -m "Update README"
git push
