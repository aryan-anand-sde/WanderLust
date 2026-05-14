import Review from "../models/Review.js";
import Listing from "../models/Listing.js";

const addReview = async (req, res) => {
  const listing = await Listing.findById(req.params.id);
  const { comment, rating } = req.body;
  const newReview = new Review({ comment, rating });
  newReview.author = req.user._id;
  listing.reviews.push(newReview);
  await newReview.save();
  await listing.save();
  res.redirect(`/listings/${listing._id}`);
};

const deleteReview = async (req, res) => {
  const { id, reviewId } = req.params;
  await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
  await Review.findByIdAndDelete(reviewId);
  res.redirect(`/listings/${id}`);
};

export { addReview, deleteReview };
