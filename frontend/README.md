# Wander Lust Frontend

The modern, premium React frontend for Wander Lust, a platform for exploring and listing unique properties. Built with a focus on high-end aesthetics, smooth interactions, and robust form management.

## 🎨 Tech Stack

- **Framework**: React 19 (Vite)
- **Styling**: Tailwind CSS 4.x
- **Form Management**: React Hook Form with Zod validation
- **Routing**: React Router 7.x
- **HTTP Client**: Axios
- **Notifications**: React Toastify (Bottom-right placement)
- **UI Components**:
  - `react-datepicker` for flexible booking dates
  - Custom `GuestSelector` for adult/child/infant management
  - Glassmorphism effects and modern CSS transitions

## 📂 Folder Structure

```text
frontend/
├── src/
│   ├── components/  # Reusable UI components (Navbar, Footer, Card, etc.)
│   ├── hooks/       # Custom hooks (e.g., useAuthGuard)
│   ├── pages/       # Page components (Listings, Auth, Profile)
│   ├── App.jsx      # Route definitions and layout wrapper
│   └── index.css    # Global styles and Tailwind configuration
```

## 🔐 Environment Variables

Create a `.env` file in the `frontend` directory:

```env
VITE_BACKEND_URL=http://localhost:3000
```

## 🛠️ Getting Started

1. **Install Dependencies**:

   ```bash
   npm install
   ```

2. **Run Development Server**:

   ```bash
   npm run dev
   ```

   The app will be available at `http://localhost:5173`.

## ✨ Key Features

- **Premium Design**: Sleek, modern interface using Tailwind 4 with vibrant gradients and glassmorphism.
- **Centralized Auth Guard**: Custom `useAuthGuard` hook that protects routes and provides instant feedback via toast notifications.
- **Dynamic Listings**: Browse, view, and manage property listings with real-time price formatting and localization.
- **Advanced Booking UX**: Integrated date picking and guest selection with intuitive hover tooltips for price breakdowns.
- **Responsive Layout**: Optimized for all devices, from mobile phones to high-resolution desktops.
- **Real-time Feedback**: Instant success/error notifications for all user actions (login, listing updates, deletions).

## 🧩 Key Components

- **Navbar & Footer**: Premium navigation with role-aware links (Guest/Host).
- **GuestSelector**: Interactive counter for managing different guest types.
- **DatePicker**: Custom-wrapped date picker with range selection logic.
- **Auth Guard**: Syncs with backend roles to ensure data integrity on the client side.
