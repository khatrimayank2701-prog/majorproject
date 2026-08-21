const User = require("../models/user");
const passport = require("passport");


// SIGNUP FORM
module.exports.signupForm = (req, res) => {
    res.render("users/usersignup");
};


// SIGNUP
module.exports.signup = async (req, res, next) => {

    try {

        const { username, email, password } = req.body;

        const newUser = new User({
            email,
            username,
        });

        const registeredUser = await User.register(
            newUser,
            password
        );

        console.log(registeredUser);

        req.login(registeredUser, (err) => {

            if (err) {
                return next(err);
            }

            req.flash(
                "success",
                "Welcome to Wonderlust!"
            );

            res.redirect("/listing");
        });

    } catch (err) {

        req.flash("error", err.message);

        res.redirect("/signup");
    }
};


// LOGIN FORM
module.exports.loginForm = (req, res) => {
    res.render("users/loginuser");
};


// LOGIN
module.exports.login = async (req, res) => {

    req.flash(
        "success",
        "Login Sucessfull"
    );

    let redirectUrl = res.locals.saveurl || "/listing";
    
    res.redirect(redirectUrl);
};


// LOGOUT
module.exports.logout = (req, res, next) => {

    req.logout(function (err) {

        if (err) {
            return next(err);
        }

        req.flash(
            "success",
            "You are logged out successfully!"
        );

        res.redirect("/listing");
    });
};