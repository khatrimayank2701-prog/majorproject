const express = require("express");
const router = express.Router();
const User= require("../models/user");
const wrapAsync = require("../utils/wrapAsync");
const passport = require("passport");
const { saveurl } = require("../middleware");

router.get("/signup", (req, res) => {
    res.render("users/usersignup");
});

router.post("/signup", wrapAsync(async (req, res) => {
    try {
        const { username, email, password } = req.body;

        const newUser = new User({
            email,
            username,
        });

        const registeredUser = await User.register(newUser, password);

        console.log(registeredUser);
        req.login(registeredUser,(err)=>{
            if(err){
                return next(err);
            }
            req.flash("success", "Welcome to Wonderlust!");

        res.redirect("/listing");
        })
        

    } catch (err) {
        req.flash("error", err.message);
        res.redirect("/signup");
    }
}));
router.get("/login",(req,res)=>{
    res.render("users/loginuser")
})
router.post("/login",saveurl,passport.authenticate("local", {
        failureRedirect: "/login",
        failureFlash: true,
    }),
    async(req, res) => {
        req.flash("success", "Login Sucessfull");
        let redirectUrl = res.locals.saveurl || "/listing";
        res.redirect(redirectUrl);
    }
);
router.get("/logout", (req, res, next) => {
    req.logout(function (err) {
        if (err) {
            return next(err);
        }

        req.flash("success", "You are logged out successfully!");
        res.redirect("/listing");
    });
});
module.exports = router;