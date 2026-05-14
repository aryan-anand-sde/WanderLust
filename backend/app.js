import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import mongoose from "mongoose";
import passport from "passport";
import User from "./models/User.js";
import session from "express-session";
import MongoStore from "connect-mongo";
import LocalStrategy from "passport-local";
import usersRouter from "./routes/users.js";
import methodOverride from "method-override";
import reviewsRouter from "./routes/reviews.js";
import listingsRouter from "./routes/listings.js";

dotenv.config();

const port = 3000;
const app = express();

const MongoDB_URL = process.env.MONGODB_URL;
await mongoose
  .connect(MongoDB_URL)
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.log("Error connecting to MongoDB:", err));

app.use(express.json());
app.use(methodOverride("_method"));
app.use(express.urlencoded({ extended: true }));

const corsOptions = {
  credentials: true,
  optionsSuccessStatus: 200,
  origin: process.env.FRONTEND_URL,
  allowedHeaders: ["Content-Type", "Authorization"],
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
};
app.use(cors(corsOptions));

const store = MongoStore.create({
  mongoUrl: MongoDB_URL,
  touchAfter: 24 * 60 * 60,
  crypto: { secret: process.env.SECRET },
});
store.on("error", (e) => console.log("SESSION STORE ERROR", e));

const sessionConfig = {
  store,
  resave: false,
  saveUninitialized: true,
  secret: process.env.SECRET,
  cookie: {
    httpOnly: true,
    maxAge: 7 * 24 * 60 * 60 * 1000,
    expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
  },
};
app.use(session(sessionConfig));
app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// Home route
app.get("/", (req, res) => res.redirect("/listings"));

app.use((req, res, next) => {
  res.locals.currentUser = req.user;
  next();
});

app.use("/", usersRouter);
app.use("/listings", listingsRouter);
app.use("/listings/:id", reviewsRouter);

app.use((error, req, res, next) => {
  let { status = 500, message = "Something went wrong" } = error;
  res.status(status).json({ error: message });
});

app.listen(port, () => {
  console.log(`Wander Lust app listening on port ${port}`);
});
