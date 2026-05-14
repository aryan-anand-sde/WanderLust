import mongoose from "mongoose";
import sampleListings from "./data.js";
import Listing from "../models/Listing.js";

const MONGO_URL = "mongodb://127.0.0.1:27017/WanderLust";
mongoose
  .connect(MONGO_URL)
  .then(() => console.log("Connected to DataBase"))
  .catch((err) => console.log(err));

const sampleOwnerId = "696159e22c3b21905bd77152";
Listing.deleteMany({}).then(() => {
  sampleListings.data = sampleListings.data.map((obj) => ({
    ...obj,
    owner: sampleOwnerId,
  }));
  Listing.insertMany(sampleListings.data);
  console.log("Data was initialized");
});
