import Booking from "../models/Booking.js";
import Listing from "../models/Listing.js";
import { ExpressError } from "../utility/ErrorHandling.js";

const createBooking = async (req, res, next) => {
  try {
    const listing = await Listing.findById(req.params.id);
    if (!listing) return next(new ExpressError(404, "Listing not found"));

    const { checkIn, checkOut, guests } = req.body;

    const checkInDate = new Date(checkIn);
    const checkOutDate = new Date(checkOut);

    if (isNaN(checkInDate) || isNaN(checkOutDate))
      return next(new ExpressError(400, "Invalid date format"));
    else if (checkInDate < new Date())
      return next(new ExpressError(400, "Check-in cannot be in the past"));
    else if (checkInDate >= checkOutDate)
      return next(new ExpressError(400, "Check-out must be after check-in"));

    // Two date ranges [A, B] and [C, D] overlap when A < D && C < B
    const conflict = await Booking.findOne({
      listing: listing._id,
      status: "booked",
      checkIn: { $lt: checkOutDate },
      checkOut: { $gt: checkInDate },
    });

    if (conflict) {
      return next(
        new ExpressError(
          409,
          `This listing is already booked from ${conflict.checkIn.toDateString()} to ${conflict.checkOut.toDateString()}. Please choose different dates.`,
        ),
      );
    }

    const nights = Math.ceil(
      (checkOutDate - checkInDate) / (1000 * 60 * 60 * 24),
    );
    const serviceFee = listing.price * 0.01;
    const totalPrice = (listing.price + serviceFee) * nights;

    const booking = new Booking({
      listing: listing._id,
      user: req.user._id,
      checkIn: checkInDate,
      checkOut: checkOutDate,
      guests: guests || { adults: 1, kids: 0, infants: 0 },
      totalPrice: Math.round(totalPrice),
    });

    await booking.save();

    listing.bookings = listing.bookings || [];
    listing.bookings.push(booking._id);
    await listing.save();

    res.status(201).json({
      message: "Booking confirmed!",
      booking,
      nights,
      totalPrice: Math.round(totalPrice),
    });
  } catch (error) {
    next(error);
  }
};

const getListingBookings = async (req, res, next) => {
  try {
    const bookings = await Booking.find({
      listing: req.params.id,
      status: "booked",
    }).select("checkIn checkOut -_id");
    res.json(bookings);
  } catch (error) {
    next(error);
  }
};

const getMyBookings = async (req, res, next) => {
  try {
    const bookings = await Booking.find({ user: req.user._id })
      .populate("listing", "title image location country price")
      .sort({ checkIn: 1 });
    res.json(bookings);
  } catch (error) {
    next(error);
  }
};

const cancelBooking = async (req, res, next) => {
  try {
    const booking = await Booking.findById(req.params.bookingId);

    if (!booking) return next(new ExpressError(404, "Booking not found"));
    if (!booking.user.equals(req.user._id))
      return next(
        new ExpressError(403, "You are not authorized to cancel this booking"),
      );
    if (booking.status === "cancelled")
      return next(new ExpressError(400, "Booking is already cancelled"));

    booking.status = "cancelled";
    await booking.save();
    res.json({ message: "Booking cancelled successfully", booking });
  } catch (error) {
    next(error);
  }
};

export { createBooking, getListingBookings, getMyBookings, cancelBooking };
