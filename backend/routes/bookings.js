import express from "express";
import { WrapAsync } from "../utility/ErrorHandling.js";
import { isLoggedIn, isNotListingOwner } from "../middlewares.js";
import {
  createBooking,
  getMyBookings,
  cancelBooking,
  getListingBookings,
} from "../controllers/bookings.js";

const bookingsRouter = express.Router({ mergeParams: true });

// GET /listings/:id/bookings — fetch booked date ranges for a listing (public)
bookingsRouter.get("/", WrapAsync(getListingBookings));

// POST /listings/:id/bookings — create a new booking
bookingsRouter.post(
  "/",
  isLoggedIn,
  isNotListingOwner,
  WrapAsync(createBooking),
);

// GET /bookings/my — get all bookings for the logged-in user (mounted separately on /bookings in app.js)
bookingsRouter.get("/my", isLoggedIn, WrapAsync(getMyBookings));

// PATCH /bookings/:bookingId/cancel — cancel a booking
bookingsRouter.patch(
  "/:bookingId/cancel",
  isLoggedIn,
  WrapAsync(cancelBooking),
);

export default bookingsRouter;
