const express = require("express");
const router = express.Router();


const passport = require("passport");


const { saveurl } = require("../middleware");
const usercontroller = require("../controllers/user");


// SIGNUP
router.route("/signup")
.get(usercontroller.signupForm)
.post(
    usercontroller.signup
);


// LOGIN
router.route("/login")
.get(usercontroller.loginForm)
.post(
    saveurl,
    passport.authenticate("local", {
        failureRedirect: "/login",
        failureFlash: true,
    }),
    usercontroller.login
);


// LOGOUT
router.get(
    "/logout",
    usercontroller.logout
);


module.exports = router;