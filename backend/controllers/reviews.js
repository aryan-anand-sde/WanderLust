import Review from "../models/Review.js";
import Listing from "../models/Listing.js";

const addReview = async (req, res) => {
  const listing = await Listing.findById(req.params.id).populate("reviews");
  const { comment, rating } = req.body;

  // One review per user per listing
  const alreadyReviewed = listing.reviews.some(
    (r) => r.author && r.author.toString() === req.user._id.toString()
  );
  if (alreadyReviewed) {
    return res.status(400).json({
      error: "You have already reviewed this listing. Delete your existing review to write a new one.",
    });
  }

  const newReview = new Review({ comment, rating });
  newReview.author = req.user._id;
  listing.reviews.push(newReview);
  await newReview.save();
  await listing.save();
  res.status(201).json({ message: "Review added successfully", review: newReview });
};

const deleteReview = async (req, res) => {
  const { id, reviewId } = req.params;
  await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
  await Review.findByIdAndDelete(reviewId);
  res.json({ message: "Review deleted successfully" });
};

export { addReview, deleteReview };
