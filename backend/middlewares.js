import Review from "./models/Review.js";
import Listing from "./models/Listing.js";
import { ExpressError } from "./utility/ErrorHandling.js";

const isLoggedIn = (req, res, next) => {
  if (req.isAuthenticated()) next();
  else {
    req.session.returnTo = req.originalUrl;
    res.status(401).json({ error: "You must be logged in first!" });
  }
};

const isListingOwner = (req, res, next) => {
  Listing.findById(req.params.id)
    .then((listing) => {
      if (!listing) {
        return res.status(404).json({ error: "Listing not found" });
      }
      if (!listing.owner || !listing.owner.equals(req.user._id)) {
        return res
          .status(403)
          .json({ error: "You don't have permission to do that!" });
      }
      next();
    })
    .catch(next);
};

const isReviewAuthor = (req, res, next) => {
  Review.findById(req.params.reviewId)
    .then((review) => {
      if (!review) {
        return res.status(404).json({ error: "Review not found" });
      }
      if (!review.author || !review.author.equals(req.user._id)) {
        return res
          .status(403)
          .json({ error: "You don't have permission to do that!" });
      }
      next();
    })
    .catch(next);
};

const saveReturnTo = (req, res, next) => {
  if (req.session.returnTo) res.locals.returnTo = req.session.returnTo;
  next();
};

export { isLoggedIn, saveReturnTo, isReviewAuthor, isListingOwner };
