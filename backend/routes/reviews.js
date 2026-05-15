import express from "express";
import { WrapAsync } from "../utility/ErrorHandling.js";
import { addReview, deleteReview } from "../controllers/reviews.js";
import { isLoggedIn, isReviewAuthor } from "../middlewares.js";

const reviewsRouter = express.Router({ mergeParams: true });

reviewsRouter.post("/", isLoggedIn, WrapAsync(addReview));

reviewsRouter.delete(
  "/:reviewId",
  isLoggedIn,
  isReviewAuthor,
  WrapAsync(deleteReview),
);

export default reviewsRouter;
