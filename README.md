# 🏨 Hotel Booking Backend - MERN Stack

<div align="center">

![JavaScript](https://img.shields.io/badge/JavaScript-100%25-yellow?style=for-the-badge&logo=javascript)
![Node.js](https://img.shields.io/badge/Node.js-v14+-green?style=for-the-badge&logo=node.js)
![Express](https://img.shields.io/badge/Express-4.x-black?style=for-the-badge&logo=express)
![MongoDB](https://img.shields.io/badge/MongoDB-Database-green?style=for-the-badge&logo=mongodb)
![License](https://img.shields.io/badge/License-MIT-blue?style=for-the-badge)

A production-ready **Hotel Booking Backend API** built with cutting-edge technologies, featuring complete authentication, role-based access control, and a full booking system.

[Explore Docs](https://github.com/Redpanda10/HotelMERN) · [Report Bug](https://github.com/Redpanda10/HotelMERN/issues) · [Request Feature](https://github.com/Redpanda10/HotelMERN/issues)

</div>

---

## ✨ Key Highlights

Designed for **real-world backend development**, this project mirrors production systems like Airbnb and Booking.com with a simplified, educational approach.

---

## 🚀 Features

### 👤 Authentication & Authorization
- ✅ User registration (Guest & Owner roles)
- ✅ Secure JWT-based login
- ✅ Bcryptjs password hashing
- ✅ Role-based access control (RBAC)
- ✅ Protected routes & middleware

### 🏨 Hotel Management
- ✅ Create & manage hotel listings
- ✅ Update hotel information
- ✅ Delete owned hotels
- ✅ View personalized listings

### 🛏️ Room Management  
- ✅ Add rooms to hotels
- ✅ Manage room details
- ✅ Update availability
- ✅ Delete rooms

### 📦 Booking System
- ✅ Book available rooms
- ✅ Automatic price calculations
- ✅ View personal bookings
- ✅ Cancel bookings

### 🔐 Security Features
- ✅ JWT authentication middleware
- ✅ Role-based authorization
- ✅ Protected API routes
- ✅ Rate limiting on login
- ✅ Centralized error handling

---

## 🛠️ Tech Stack

| Technology | Purpose |
|-----------|---------|
| **Node.js** | Runtime Environment |
| **Express.js** | Web Framework |
| **MongoDB** | NoSQL Database |
| **Mongoose** | ODM (Object Document Mapper) |
| **JWT** | Authentication |
| **Bcryptjs** | Password Encryption |
| **express-rate-limit** | API Rate Limiting |

---

## 📁 Project Structure

```
server/
├── controller/
│   ├── userController.js
│   ├── hotelController.js
│   ├── roomController.js
│   └── bookingController.js
├── model/
│   ├── userModel.js
│   ├── hotelModel.js
│   ├── roomModel.js
│   └── bookingModel.js
├── routes/
│   ├── authRoutes.js
│   ├── hotelRoutes.js
│   ├── roomRoutes.js
│   └── bookingRoutes.js
├── middleware/
│   ├── authMiddleware.js
│   └── errorMiddleware.js
├── config/
│   └── db.js
└── server.js
```

---

## ⚙️ Installation & Setup

### Prerequisites
- Node.js (v14 or higher)
- MongoDB
- npm or yarn

### Steps

```bash
# 1. Clone the repository
git clone https://github.com/your-username/hotel-booking-backend.git
cd hotel-booking-backend

# 2. Install dependencies
npm install

# 3. Create .env file with configuration
echo "DATABASE_URL=your_mongodb_url" > .env
echo "JWT_SECRET=your_secret_key" >> .env
echo "PORT=5000" >> .env

# 4. Run the server
npm start              # Production
npm run dev           # Development with nodemon
```

---

## 🔌 API Endpoints

### 👤 Authentication Routes
| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/auth/register` | Register new user |
| `POST` | `/auth/login` | Login user |
| `GET` | `/auth/profile` | Get user profile |
| `PUT` | `/auth/profile` | Update profile |

### 🏨 Hotel Routes
| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| `GET` | `/hotels` | Public | Get all hotels |
| `GET` | `/hotels/:id` | Public | Get hotel details |
| `POST` | `/hotels` | Owner | Create hotel |
| `PUT` | `/hotels/:id` | Owner | Update hotel |
| `DELETE` | `/hotels/:id` | Owner | Delete hotel |
| `GET` | `/hotels/owner/listing` | Owner | Get my listings |

### 🛏️ Room Routes
| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| `GET` | `/rooms` | Public | Get all rooms |
| `GET` | `/rooms/:id` | Public | Get room details |
| `POST` | `/rooms` | Owner | Add room |
| `PUT` | `/rooms/:id` | Owner | Update room |
| `DELETE` | `/rooms/:id` | Owner | Delete room |

### 📦 Booking Routes
| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| `POST` | `/bookings` | Guest | Create booking |
| `GET` | `/bookings/my` | Guest | View my bookings |
| `DELETE` | `/bookings/:id` | Guest | Cancel booking |
| `GET` | `/bookings/incoming` | Owner | View incoming bookings |
| `GET` | `/bookings/:id` | Auth | Get booking details |

---

## 🔐 Middleware System

### Authentication
```
verifyToken() → Validates JWT token
```

### Authorization
```
requireOwner() → Owner-only access
requireGuest() → Guest-only access
```

---

## 💡 Business Logic

### Booking Price Calculation
```javascript
nights = checkOut - checkIn
totalPrice = nights × pricePerNight
```

### Role-Based Permissions

| Role | Permissions |
|------|------------|
| **Guest** | 📖 Book rooms, 📋 View bookings |
| **Owner** | 🏨 Manage hotels, 🛏️ Manage rooms |

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](./LICENSE) file for details.

---

## 👤 Author

**Redpanda10** - [GitHub Profile](https://github.com/Redpanda10)

---

<div align="center">

**[⬆ back to top](#-hotel-booking-backend---mern-stack)**

Made with ❤️ for the developer community

</div>
