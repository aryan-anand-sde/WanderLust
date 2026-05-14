import multer from "multer";
import express from "express";
import { storage } from "../utility/cloudConfig.js";
import { WrapAsync } from "../utility/ErrorHandling.js";
import { isListingOwner, isLoggedIn } from "../middlewares.js";
import {
  indexRoute,
  newListing,
  showListing,
  editListing,
  deleteListing,
} from "../controllers/listings.js";

const listingsRouter = express.Router();
const upload = multer({ storage: storage });

listingsRouter
  .route("/")
  .get(WrapAsync(indexRoute))
  .post(isLoggedIn, upload.single("image"), WrapAsync(newListing));

listingsRouter
  .route("/:id")
  .get(WrapAsync(showListing))
  .put(
    isLoggedIn,
    isListingOwner,
    upload.single("image"),
    WrapAsync(editListing),
  )
  .delete(isLoggedIn, isListingOwner, WrapAsync(deleteListing));

export default listingsRouter;
