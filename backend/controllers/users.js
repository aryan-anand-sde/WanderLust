import User from "../models/User.js";

const signup = async (req, res, next) => {
  try {
    const { name, email, username, password, role } = req.body;
    const newUser = new User({ name, email, username, role: role || "guest" });
    const registeredUser = await User.register(newUser, password);

    req.login(registeredUser, (err) => {
      if (err) return next(err);
      return res.status(201).json({
        success: true,
        message: "Welcome to WanderLust!",
        user: registeredUser,
      });
    });
  } catch (e) {
    return res.status(400).json({
      success: false,
      message: e.message,
    });
  }
};

const login = (req, res) => {
  // Note: Passport.js middleware (passport.authenticate('local')) should run in your routes file before hitting this controller.
  res.status(200).json({
    success: true,
    message: "Welcome back to WanderLust!",
    user: req.user,
  });
};

const logout = (req, res, next) => {
  req.logout((err) => {
    if (err) return next(err);
    res.status(200).json({
      success: true,
      message: "You're successfully logged out!",
    });
  });
};

export { signup, login, logout };
