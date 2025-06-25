# CampusNest

CampusNest is a full-stack web application designed to streamline the process of finding, listing, and booking student accommodations (PGs, flats, etc.) near campus. It features a robust admin dashboard, landlord property management, and a seamless booking experience for students.

---

## 🚀 Features

### 🌟 Most Impressive Features
- **Role-Based Access:** Student, Landlord, and Admin roles with tailored dashboards and permissions.
- **Admin Analytics Dashboard:** Real-time stats on users, listings, bookings, most booked areas, and top-rated PGs.
- **Property Approval Workflow:** Admins can approve/reject listings; pending/approved status for properties.
- **Rich Property Listings:** Photos, amenities, lease terms, room types, occupancy, and more.
- **Advanced Filtering:** Search and filter properties by price, location, amenities, type, occupancy, and rating.
- **Booking Management:** Students can book, modify, or cancel; landlords can approve/reject bookings.
- **Google OAuth Integration:** Register/login with Google for both students and landlords.
- **Image Uploads:** Upload property photos via file or direct link.
- **Mock Data Support:** Demo/test the app with realistic mock property data.

### 🏠 User Roles
- **Student:** Browse, filter, and book properties; manage bookings.
- **Landlord:** List/manage properties, view bookings, update property details.
- **Admin:** Approve/reject properties, view analytics, manage users and listings.

---

## 🖥️ Tech Stack

- **Frontend:** React, React Router, Tailwind CSS, Axios, Vite
- **Backend:** Node.js, Express, MongoDB (Mongoose), JWT Auth, Multer, Nodemailer
- **Other:** Google Firebase (for OAuth), AWS S3 SDK (for image uploads), dotenv

---

## 📦 Project Structure

```
CampusNest/
  API/           # Backend (Node.js/Express)
    src/
      controllers/
      models/
      routes/
      middleware/
      config/
      utils/
    uploads/     # Uploaded images
    index.js     # Entry point
    createAdmin.js # Script to create admin user
    package.json
  client/        # Frontend (React)
    src/
      pages/
      components/
      context/
      services/
      assets/
    public/
    index.html
    package.json
```

---

## ⚙️ Setup Instructions

### 1. Clone the Repository
```bash
git clone <repo-url>
cd CampusNest
```

### 2. Backend Setup (API)
```bash
cd API
npm install
# Create a .env file with the following:
# MONGO_URL=mongodb://localhost:27017/campusnest
# JWT_SECRET=your-secret-key
# CLIENT_URL=http://localhost:5173
npm start
```

#### Create an Admin User
```bash
node createAdmin.js
```

### 3. Frontend Setup (client)
```bash
cd ../client
npm install
npm run dev
```

---

## 🌐 API Overview

### Auth
- `POST /api/auth/register` — Register (student/landlord, supports Google)
- `POST /api/auth/login` — Login (classic/Google)
- `GET /api/auth/profile` — Get current user profile
- `POST /api/auth/logout` — Logout

### Properties
- `POST /api/places` — Create property (landlord)
- `GET /api/places/user-places` — Get landlord's properties
- `GET /api/places/:id` — Get property by ID
- `PUT /api/places` — Update property
- `GET /api/places` — List all approved properties
- `GET /api/places/admin/pending` — List pending properties (admin)
- `PATCH /api/places/admin/:id/approve` — Approve property (admin)
- `PATCH /api/places/admin/:id/reject` — Reject property (admin)

### Bookings
- `POST /api/bookings` — Create booking
- `GET /api/bookings` — Get user's bookings
- `GET /api/bookings/:id` — Get booking by ID
- `PUT /api/bookings/:id/status` — Update booking status (approve/reject/cancel/modify)

### Admin
- `GET /api/admin/analytics` — Get analytics (users, listings, bookings, top areas, top PGs)

### Uploads
- `POST /api/upload/upload-by-link` — Upload image by link
- `POST /api/upload/upload` — Upload image file(s)

---

## 🧑‍💻 Development Notes
- **Mock Data:** The frontend includes mock property data for demo/testing (see `client/src/services/pg_flat_data_nsut.json`).
- **Environment Variables:** See `.env.example` or setup section above for required variables.
- **Error Handling:** Centralized error handler for API responses.
- **Security:** JWT-based authentication, role checks, and secure password storage (bcrypt).

---

## 📸 Screenshots
> _Add screenshots/gifs here to showcase the UI, dashboards, and booking flow._

---

## 📄 License
This project is licensed under the ISC License. 