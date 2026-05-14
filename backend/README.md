# Wander Lust Backend

The backend server for Wander Lust, a premium travel and accommodation platform. This is a robust Express.js API built to handle property listings, user authentication, reviews, and bookings with Cloudinary integration for image management.

## 🚀 Tech Stack

- **Framework**: Express.js (v5.x)
- **Database**: MongoDB with Mongoose (v9.x)
- **Authentication**: Passport.js with `passport-local` and `passport-local-mongoose`
- **Session Management**: `express-session` with `connect-mongo` (Session persistence in DB)
- **File Handling**: Multer with `multer-storage-cloudinary`
- **Cloud Storage**: Cloudinary (v1.x)
- **Environment**: Node.js (ES Modules)

## 📂 Folder Structure

```text
backend/
├── controllers/    # Route logic and database operations
├── init/           # Database initialization and seeding scripts
├── models/         # Mongoose schemas (User, Listing, Review, Booking)
├── routes/         # Express router definitions
├── utility/        # Configuration (Cloudinary, Error Handling)
├── middlewares.js  # Custom authorization and authentication checks
└── app.js          # Main entry point and server configuration
```

## 🔐 Environment Variables

Create a `.env` file in the `backend` directory with the following keys:

```env
MONGODB_URL=your_mongodb_connection_string
SECRET=your_session_secret
FRONTEND_URL=http://localhost:5173
CLOUDINARY_NAME=your_cloudinary_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
```

## 🛠️ Getting Started

1. **Install Dependencies**:

   ```bash
   npm install
   ```

2. **Initialize Database (Optional Seeding)**:

   ```bash
   node init/init.js
   ```

3. **Start the Server**:

   ```bash
   node app.js
   ```

   The server will start on `http://localhost:3000`.

## ✨ Key Features

- **Robust Auth**: Secure user registration and login using Passport.js.
- **Role-Based Access**: Specialized middlewares to protect routes based on user roles (Guest/Host) and resource ownership.
- **Cloudinary Integration**: Automated image uploading to Cloudinary when creating listings, and automatic cleanup when listings are deleted.
- **Interactive Review System**: Users can leave reviews on listings with star ratings and comments.
- **Premium Error Handling**: Centralized error management with custom `ExpressError` and `WrapAsync` utilities for clean code.
- **RESTful Architecture**: Clean and organized API routes for all major resources.

## 🛡️ Middlewares

The backend includes several critical middlewares in `middlewares.js`:

- `isLoggedIn`: Ensures the user is authenticated.
- `isListingOwner`: Ensures only the host who created the listing can edit or delete it.
- `isReviewAuthor`: Ensures only the author of a review can delete it.
