import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema(
  {
    listing: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Listing",
      required: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    checkIn: {
      type: Date,
      required: true,
    },
    checkOut: {
      type: Date,
      required: true,
    },
    guests: {
      adults: { type: Number, default: 1, min: 1 },
      kids: { type: Number, default: 0, min: 0 },
      infants: { type: Number, default: 0, min: 0 },
    },
    totalPrice: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      default: "booked",
      enum: ["booked", "cancelled"],
    },
  },
  { timestamps: true },
);

// Index for efficient date-overlap queries per listing
bookingSchema.index({ listing: 1, status: 1, checkIn: 1, checkOut: 1 });

// will be saved as "bookings" collection in MongoDB
export default mongoose.model("Booking", bookingSchema);
