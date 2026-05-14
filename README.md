# Wander Lust 🏡✈️

A full-stack, modern web application for discovering and listing unique places to stay across India and beyond. Wander Lust is a premium Airbnb-inspired platform where users can browse stunning properties, hosts can manage their listings end-to-end, and guests can leave reviews — all wrapped in a sleek, glassmorphism-inspired UI.

## 🌟 Features

- **Role-Based Experience**: Separate and distinct flows for **Guests** and **Hosts**
- **User Authentication**: Secure signup/login with Passport.js and persistent MongoDB sessions
- **Property Listings**: Browse, search, and view detailed accommodation listings
- **Host Dashboard**: Hosts can create, edit, and permanently delete their own listings
- **Cloudinary Image Management**: Automatic upload _and_ deletion of property images on Cloudinary
- **Reviews & Ratings**: Guests can leave star-rated reviews; only review authors can delete them
- **Advanced Booking UX**: Interactive date picker with check-in/check-out range and a custom Guest Selector (Adults, Kids, Infants)
- **Interactive Pricing**: Real-time price breakdown with tooltips on hover (Base fare, Service fee, Total)
- **Indian Rupee (₹) Localization**: All prices formatted in `en-IN` locale
- **Centralized Auth Guards**: Frontend `useAuthGuard` hook mirrors backend middleware to prevent unauthorized access with instant toast notifications
- **Toast Notifications**: Context-aware feedback for every user action (bottom-right, color-coded)
- **Responsive Design**: Premium mobile-to-desktop responsive layout

## 🛠️ Tech Stack

### Backend

| Technology                              | Purpose                        |
| --------------------------------------- | ------------------------------ |
| **Node.js** (v24.9.0)                   | Runtime environment            |
| **Express.js** (v5.x)                   | Web framework                  |
| **MongoDB** + **Mongoose** (v9.x)       | Database and ODM               |
| **Passport.js** (local strategy)        | Authentication                 |
| **express-session** + **connect-mongo** | Persistent session storage     |
| **Cloudinary** + **Multer**             | Image upload and cloud storage |
| **CORS**                                | Cross-origin request handling  |

### Frontend

| Technology                    | Purpose                        |
| ----------------------------- | ------------------------------ |
| **React 19** + **Vite**       | UI framework and build tool    |
| **Tailwind CSS 4.x**          | Utility-first styling          |
| **React Router 7.x**          | Client-side routing            |
| **Axios**                     | HTTP client                    |
| **React Hook Form** + **Zod** | Form management and validation |
| **react-datepicker**          | Booking date selection         |
| **react-toastify**            | Toast notifications            |

## 📁 Project Structure

```bash
Wander Lust/
├── backend/
│   ├── app.js                 # Main server entry point
│   ├── middlewares.js         # isLoggedIn, isListingOwner, isReviewAuthor
│   ├── controllers/           # Route logic (listings, reviews, users)
│   ├── models/                # Mongoose schemas (Listing, Review, User, Booking)
│   ├── routes/                # Express routers
│   ├── utility/               # cloudConfig.js, ErrorHandling.js
│   └── init/                  # DB seed scripts
│
└── frontend/
    ├── src/
    │   ├── App.jsx            # Route definitions
    │   ├── components/        # Navbar, Footer, Card, GuestSelector, DatePicker
    │   ├── hooks/             # useAuthGuard (centralized route protection)
    │   ├── pages/
    │   │   ├── auth/          # Login, Signup
    │   │   └── listings/      # ListingsIndex, DisplayListing, NewListing, EditListing, MyListings
    │   └── index.css          # Global styles
    └── vite.config.js
```

## 🚀 Getting Started

### Prerequisites

- Node.js (v24.9.0+)
- MongoDB (local or Atlas)
- Cloudinary account

### Backend Setup

1. **Navigate to the backend folder and install dependencies**:

   ```bash
   cd backend
   npm install
   ```

2. **Create a `.env` file** inside `backend/`:

   ```env
   MONGODB_URL=your_mongodb_connection_string
   SECRET=your_session_secret_key
   FRONTEND_URL=http://localhost:5173
   CLOUDINARY_NAME=your_cloudinary_name
   CLOUDINARY_API_KEY=your_cloudinary_api_key
   CLOUDINARY_API_SECRET=your_cloudinary_api_secret
   ```

3. **Seed the database (optional)**:

   ```bash
   node init/init.js
   ```

4. **Start the server**:

   ```bash
   node app.js
   ```

   The API will be running at `http://localhost:3000`.

### Frontend Setup

1. **Navigate to the frontend folder and install dependencies**:

   ```bash
   cd frontend
   npm install
   ```

2. **Create a `.env` file** inside `frontend/`:

   ```env
   VITE_BACKEND_URL=http://localhost:3000
   ```

3. **Start the development server**:

   ```bash
   npm run dev
   ```

   The app will be available at `http://localhost:5173`.

## 🔒 Security Features

- Password hashing via `passport-local-mongoose`
- Session-based authentication with HttpOnly cookies (7-day expiry)
- Backend authorization middleware (`isLoggedIn`, `isListingOwner`, `isReviewAuthor`) returning proper HTTP status codes (401, 403)
- Frontend `useAuthGuard` hook prevents unauthorized page access client-side
- Role-based UI rendering — hosts and guests see different interfaces

## 📝 Usage

### As a Guest

1. **Sign Up / Log In** to access the platform
2. **Browse Listings** on the homepage
3. **View Details** — see pricing, location, amenities, and reviews
4. **Leave Reviews** with a star rating and comment

### As a Host

1. **Sign Up** with the Host role
2. **Create a New Listing** with title, description, price, location, and an image
3. **Manage Your Listings** from the "My Listings" dashboard
4. **Edit or Delete** your listings — deleted images are automatically removed from Cloudinary

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the ISC License.

## 👤 Author : Aryan Anand

- GitHub: [@aryan-anand-sde](https://github.com/aryan-anand-sde)

## 🙏 Acknowledgments

- Inspired by Airbnb's user interface and functionality
- Built as a full-stack web development project
- Thanks to the open-source community for amazing tools and libraries

---

⭐ If you found this project helpful, please give it a star!
