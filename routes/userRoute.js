const express = require("express");
const router = express.Router();
const User = require("../models/user"); // <-- Add this line at the top
const wrapAsync = require("../utilis/wrapAsync");
const passport = require("passport");
const { savedredirectUrl } = require("../middleware");
const UserController = require("../controllers/users.js");

router
  .route("/signup")
  .get( UserController.signup)
  .post( wrapAsync(UserController.SignupForm));

router
  .route("/login")
  .get( UserController.login)
  .post(
    
    savedredirectUrl,
    passport.authenticate("local", {
      failureRedirect: "/login",
      failureFlash: true,
    }),
    UserController.LoginForm
  );

router.get("/logout", UserController.logout); // Use the logout controller method

module.exports = router;
