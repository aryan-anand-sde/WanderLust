import express from "express";
import passport from "passport";
import { saveReturnTo } from "../middlewares.js";
import { WrapAsync } from "../utility/ErrorHandling.js";
import { signup, login, logout } from "../controllers/users.js";

const usersRouter = express.Router();

usersRouter.route("/signup").post(WrapAsync(signup));

usersRouter.route("/login").post((req, res, next) => {
  passport.authenticate("local", (err, user, info) => {
    if (err) return next(err);
    if (!user) {
      return res.status(401).json({
        success: false,
        message: info?.message || "Invalid username or password",
      });
    }
    req.login(user, (err) => {
      if (err) return next(err);
      next();
    });
  })(req, res, next);
}, WrapAsync(login));

usersRouter.get("/logout", logout);

export default usersRouter;
