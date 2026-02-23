# 🏥 Prescripto - Healthcare Management Platform

A comprehensive healthcare management solution connecting patients, doctors, and administrators through a seamless digital experience.

![Prescripto Banner](https://res.cloudinary.com/dh7uptai7/image/upload/v1234567890/prescripto-banner.png)

## 📋 Table of Contents
- [Overview](#-overview)
- [Key Features](#-key-features)
- [Technology Stack](#-technology-stack)
- [Screenshots](#-screenshots)
- [Installation](#-installation)
- [Environment Variables](#-environment-variables)
- [API Documentation](#-api-documentation)
- [Project Structure](#-project-structure)
- [Contributing](#-contributing)
- [License](#-license)
- [Contact](#-contact)

## 🎯 Overview

**Prescripto** is a full-stack healthcare management platform that revolutionizes how medical services are delivered. With three integrated interfaces - **Patient Portal**, **Doctor Panel**, and **Admin Panel** - it provides a complete ecosystem for healthcare management, from appointment booking to practice administration.

## ✨ Key Features

### 👤 Patient Portal
- **🔍 Doctor Discovery**: Browse and search doctors by specialty, experience, and availability
- **📅 Appointment Booking**: Real-time slot availability with easy scheduling
- **📱 Appointment Management**: View, reschedule, or cancel appointments
- **💬 Secure Messaging**: Contact healthcare providers through integrated messaging
- **💳 Payment Integration**: Secure online payments via Paymob
- **👤 Profile Management**: Maintain personal health information and preferences
- **📋 Appointment History**: Track past and upcoming appointments

### 👨‍⚕️ Doctor Panel
- **📊 Dashboard**: Real-time statistics on appointments, patients, and performance
- **📋 Appointment Management**: View and manage scheduled appointments
- **👥 Patient Records**: Access patient information and medical history
- **⏰ Schedule Management**: Set availability and manage working hours
- **📝 Profile Management**: Update professional information and consultation fees
- **📈 Performance Analytics**: Track completion rates and patient demographics

### 🔧 Admin Panel
- **📊 Dashboard**: Comprehensive platform overview with key metrics
- **👨‍⚕️ Doctor Management**: Add, edit, and monitor doctor profiles
- **📅 Appointment Oversight**: View and manage all appointments
- **💬 Patient Communication**: Handle patient inquiries through messaging
- **💰 Revenue Tracking**: Monitor earnings with real-time analytics
- **📊 System Analytics**: Track platform usage and performance metrics
- **🔐 User Management**: Manage admin and doctor accounts

## 🚀 Technology Stack

### Frontend
| Technology | Version | Purpose |
|------------|---------|---------|
| React | 19.2.0 | UI library |
| React Router DOM | 7.13.0 | Navigation |
| Tailwind CSS | 4.1.18 | Styling |
| React Hot Toast | 2.6.0 | Notifications |
| React Icons | 5.5.0 | Icons |
| Axios | 1.13.5 | HTTP client |
| Vite | 7.3.1 | Build tool |

### Backend
| Technology | Version | Purpose |
|------------|---------|---------|
| Node.js | 18+ | Runtime |
| Express.js | 4.18.2 | Web framework |
| MongoDB | 6.0+ | Database |
| Mongoose | 7.5.0 | ODM |
| JWT | 9.0.2 | Authentication |
| Bcrypt | 5.1.1 | Password hashing |
| Cloudinary | 1.41.0 | Image storage |
| Paymob | - | Payment gateway |
| Validator | 13.11.0 | Input validation |

## 📸 Screenshots

### Patient Portal
| Home Page | Doctor Listing | Appointment Booking |
|-----------|---------------|---------------------|
| ![Home](https://res.cloudinary.com/dh7uptai7/image/upload/v1/screenshots/home.png) | ![Doctors](https://res.cloudinary.com/dh7uptai7/image/upload/v1/screenshots/doctors.png) | ![Booking](https://res.cloudinary.com/dh7uptai7/image/upload/v1/screenshots/booking.png) |

### Doctor Panel
| Dashboard | Appointments | Profile |
|-----------|--------------|---------|
| ![Doctor Dashboard](https://res.cloudinary.com/dh7uptai7/image/upload/v1/screenshots/doctor-dashboard.png) | ![Doctor Appointments](https://res.cloudinary.com/dh7uptai7/image/upload/v1/screenshots/doctor-appointments.png) | ![Doctor Profile](https://res.cloudinary.com/dh7uptai7/image/upload/v1/screenshots/doctor-profile.png) |

### Admin Panel
| Dashboard | Doctors List | Messages |
|-----------|--------------|----------|
| ![Admin Dashboard](https://res.cloudinary.com/dh7uptai7/image/upload/v1/screenshots/admin-dashboard.png) | ![Doctors List](https://res.cloudinary.com/dh7uptai7/image/upload/v1/screenshots/doctors-list.png) | ![Messages](https://res.cloudinary.com/dh7uptai7/image/upload/v1/screenshots/messages.png) |

## 💻 Installation

### Prerequisites
- Node.js (v18 or higher)
- MongoDB (v6.0 or higher)
- Cloudinary account
- Paymob account (for payment integration)

### Step 1: Clone the Repository
```bash
git clone https://github.com/yourusername/prescripto.git
cd prescripto
Step 2: Install Backend Dependencies
bash
cd server
npm install
Step 3: Install Frontend Dependencies
bash
cd ../client
npm install
Step 4: Set Up Environment Variables
Backend (.env)
Create a .env file in the server directory:

env
# Server Configuration
PORT=5000
MONGODB_URI=mongodb+srv://your_username:your_password@cluster.mongodb.net/prescripto
JWT_SECRET=your_super_secret_jwt_key_change_this

# Cloudinary Configuration
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret

# Paymob Configuration
PAYMOB_API_KEY=your_paymob_api_key
PAYMOB_INTEGRATION_ID=your_paymob_integration_id
PAYMOB_IFRAME_ID=your_paymob_iframe_id
PAYMOB_HMAC_SECRET=your_paymob_hmac_secret

# Frontend URL
FRONTEND_URL=http://localhost:5173
Frontend (.env)
Create a .env file in the client directory:

env
VITE_BACKEND_URL=http://localhost:5000
Step 5: Run the Application
Backend
bash
cd server
npm run dev
Frontend
bash
cd client
npm run dev
The application will be available at:

Frontend: http://localhost:5173

Backend API: http://localhost:5000

🔑 Environment Variables Explained
Backend Variables
Variable	Description	Required
PORT	Server port number	Yes
MONGODB_URI	MongoDB connection string	Yes
JWT_SECRET	Secret key for JWT tokens	Yes
CLOUDINARY_CLOUD_NAME	Cloudinary cloud name	Yes
CLOUDINARY_API_KEY	Cloudinary API key	Yes
CLOUDINARY_API_SECRET	Cloudinary API secret	Yes
PAYMOB_API_KEY	Paymob API key	Yes
PAYMOB_INTEGRATION_ID	Paymob integration ID	Yes
PAYMOB_IFRAME_ID	Paymob iframe ID	Yes
PAYMOB_HMAC_SECRET	Paymob HMAC secret	Yes
FRONTEND_URL	Frontend application URL	Yes
Frontend Variables
Variable	Description	Required
VITE_BACKEND_URL	Backend API URL	Yes
📡 API Documentation
Public Routes
Method	Endpoint	Description	Auth
POST	/api/user/register	User registration	Public
POST	/api/user/login	User login	Public
GET	/api/doctor/list	Get all doctors	Public
POST	/api/message/send	Contact form	Public
User Routes (Protected)
Method	Endpoint	Description	Auth
GET	/api/user/profile	Get user profile	User
PUT	/api/user/update-profile	Update profile	User
POST	/api/user/book-appointment	Book appointment	User
GET	/api/user/my-appointments	Get user appointments	User
POST	/api/user/cancel-appointment	Cancel appointment	User
Admin Routes (Protected)
Method	Endpoint	Description	Auth
POST	/api/admin/login	Admin login	Public
GET	/api/admin/doctors-list	Get all doctors	Admin
POST	/api/admin/add-doctor	Add new doctor	Admin
PATCH	/api/admin/change-availability	Toggle doctor availability	Admin
GET	/api/admin/appointments	Get all appointments	Admin
GET	/api/admin/dashboard/stats	Dashboard stats	Admin
Doctor Routes (Protected)
Method	Endpoint	Description	Auth
POST	/api/doctor/login	Doctor login	Public
GET	/api/doctor/profile	Get doctor profile	Doctor
PUT	/api/doctor/update-profile	Update profile	Doctor
GET	/api/doctor/appointments	Get doctor appointments	Doctor
PATCH	/api/doctor/appointments/:id/status	Update appointment status	Doctor
Payment Routes
Method	Endpoint	Description	Auth
POST	/api/payment/create-order	Create payment order	User
POST	/api/payment/callback	Paymob callback	Public
GET	/api/payment/status/:appointmentId	Check payment status	User
📁 Project Structure
text
prescripto/
├── server/                          # Backend
│   ├── controllers/                  # Business logic
│   │   ├── adminController.js
│   │   ├── doctorController.js
│   │   ├── userController.js
│   │   ├── appointmentController.js
│   │   ├── paymentController.js
│   │   └── messageController.js
│   ├── models/                        # Database models
│   │   ├── Doctor.js
│   │   ├── User.js
│   │   ├── Appointment.js
│   │   └── Message.js
│   ├── routes/                         # API routes
│   │   ├── adminRouter.js
│   │   ├── doctorRouter.js
│   │   ├── userRouter.js
│   │   ├── paymentRouter.js
│   │   └── messageRouter.js
│   ├── middleware/                     # Auth middleware
│   │   ├── authAdmin.js
│   │   ├── authDoctor.js
│   │   └── authUser.js
│   ├── config/                         # Configuration
│   │   ├── cloudinary.js
│   │   └── db.js
│   └── server.js                        # Entry point
│
└── client/                             # Frontend
    ├── public/                          # Static files
    └── src/
        ├── assets/                       # Images, icons
        ├── components/                    # Reusable components
        │   ├── Navbar.jsx
        │   ├── Footer.jsx
        │   ├── Sidebar.jsx
        │   └── ProtectedRoute.jsx
        ├── pages/                         # Page components
        │   ├── Home.jsx
        │   ├── Login.jsx
        │   ├── Contact.jsx
        │   ├── About.jsx
        │   ├── Doctors.jsx
        │   ├── Appointment.jsx
        │   ├── MyAppointment.jsx
        │   ├── MyProfile.jsx
        │   ├── admin/                      # Admin pages
        │   │   ├── Dashboard.jsx
        │   │   ├── AllAppointments.jsx
        │   │   ├── AddDoctor.jsx
        │   │   ├── DoctorsList.jsx
        │   │   └── AdminMessages.jsx
        │   └── doctor/                     # Doctor pages
        │       ├── DoctorDashboard.jsx
        │       ├── DoctorAppointments.jsx
        │       └── DoctorProfile.jsx
        ├── context/                        # React context
        │   ├── AppContext.jsx
        │   ├── AdminContext.jsx
        │   └── DoctorContext.jsx
        └── App.jsx                          # Main app
🤝 Contributing
Contributions are welcome! Please follow these steps:

Fork the repository

Create a feature branch (git checkout -b feature/AmazingFeature)

Commit your changes (git commit -m 'Add some AmazingFeature')

Push to the branch (git push origin feature/AmazingFeature)

Open a Pull Request

Development Guidelines
Follow the existing code style

Write meaningful commit messages

Update documentation for new features

Add tests for new functionality

Ensure all tests pass before submitting PR

📄 License
This project is licensed under the MIT License - see the LICENSE file for details.

text
MIT License

Copyright (c) 2024 Prescripto

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
📞 Contact & Support
Email: support@prescripto.com

Website: https://prescripto.com

GitHub: https://github.com/yourusername/prescripto

Twitter: @prescripto

Demo Credentials
Role	Email	Password
Admin	admin@prescripto.com	admin123
Doctor	doctor@prescripto.com	doctor123
Patient	patient@example.com	patient123
⭐ Show Your Support
If you find this project helpful, please consider giving it a ⭐ on GitHub!

Prescripto - Making Healthcare Accessible, One Appointment at a Time. 🏥
