import Listing from "../models/Listing.js";
import { ExpressError } from "../utility/ErrorHandling.js";
import { cloudinary } from "../utility/cloudConfig.js";

const indexRoute = (req, res) => {
  Listing.find({}).then((listings) => res.json(listings));
};

const newListing = (req, res, next) => {
  const newListing = new Listing(req.body);
  newListing.owner = req.user._id;
  newListing.image = { url: req.file.path, filename: req.file.filename };
  newListing
    .save()
    .then((listing) => res.status(201).json(listing))
    .catch((err) => next(new ExpressError(400, err.message)));
};

const showListing = (req, res) => {
  Listing.findById(req.params.id)
    .populate("owner")
    .populate({
      path: "reviews",
      populate: {
        path: "author",
      },
    })
    .then((listing) => {
      if (listing) res.json(listing);
      else res.status(404).json({ error: "Listing not found" });
    });
};

const editListingForm = (req, res) => {
  Listing.findById(req.params.id).then((listing) => {
    if (listing) {
      let resizedImageUrl = listing.image.url.replace(
        "/upload",
        "/upload/w_250/",
      );
      res.render("./listings/edit.ejs", { listing, resizedImageUrl });
    } else {
      res.redirect("/listings");
    }
  });
};
const editListing = (req, res) => {
  if (req.file)
    req.body.image = { url: req.file.path, filename: req.file.filename };
  Listing.findByIdAndUpdate(req.params.id, req.body, { new: true }).then((listing) =>
    res.json(listing)
  );
};

const deleteListing = async (req, res, next) => {
  try {
    const deletedListing = await Listing.findByIdAndDelete(req.params.id);
    
    // Delete image from Cloudinary if it exists
    if (deletedListing && deletedListing.image && deletedListing.image.filename) {
      await cloudinary.uploader.destroy(deletedListing.image.filename);
    }
    
    res.json({ message: "Listing and associated image deleted successfully" });
  } catch (error) {
    next(error);
  }
};

export { indexRoute, newListing, showListing, editListing, deleteListing };
