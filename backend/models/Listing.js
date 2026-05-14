import mongoose from "mongoose";
import Review from "./Review.js";

const listingSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  image: {
    url: { type: String, required: true },
    filename: { type: String, required: true },
  },
  price: { type: Number, required: true, min: 0 },
  location: { type: String, required: true },
  country: { type: String, required: true },
  reviews: [{ type: mongoose.Schema.Types.ObjectId, ref: "Review" }],
  owner: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  bookings: [{ type: mongoose.Schema.Types.ObjectId, ref: "Booking" }],
});

listingSchema.post("findOneAndDelete", async function (listing) {
  if (listing) {
    await Review.deleteMany({
      _id: { $in: listing.reviews },
    });
  }
});

// Will be saved as 'listings' collection in db
export default mongoose.model("Listing", listingSchema);
