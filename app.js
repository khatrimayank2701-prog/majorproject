const express = require("express");
const app = express();

const mongoose = require("mongoose");
const Listing = require("./models/listing.js");
const Review=require("./models/review.js");
const path = require("path");
const console = require("console");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const ExpressError = require("./utils/ExpressError");
const wrapAsync=require("./utils/wrapAsync.js");
const { listingSchema,reviewSchema } = require("./schema");
const listingRouter = require("./routes/listing");
const reviewRouter = require("./routes/review");
const session=require("express-session");
const flash=require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user");
const userRouter=require("./routes/user.js");

app.engine("ejs", ejsMate);
// set ejs
app.set("view engine", "ejs");
// set views folder
app.set("views", path.join(__dirname, "views"));
// static files
app.use(express.static(path.join(__dirname, "public")));
//parsing
app.use(express.urlencoded({extended:true}));


app.use(methodOverride("_method"));
async function main() {
    await mongoose.connect("mongodb://127.0.0.1:27017/wonderlust");
}

main()
.then(() => {
    console.log("connected to db");
})
.catch((err) => {
    console.log(err);
});
app.use(session({secret:"mytopclasssecret",
    resave:false,
    saveUninitialized:true,
    cookie: {
        expires: new Date(Date.now() + 1000 * 60 * 60 * 24),
        maxAge: 1000 * 60 * 60 * 24,
        httpOnly:true
    }
}))
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req,res,next)=>{
    res.locals.success=req.flash("success");
    res.locals.error=req.flash("error");
    res.locals.currUser=req.user;
    next();
})

app.use("/listing", listingRouter);
app.use("/listing/:id/reviews", reviewRouter);
app.use("/",userRouter);

app.get("/", (req, res) => {
    res.send("Hello World");
});


app.use((err, req, res, next) => {
    let { statusCode = 500, message = "Something went wrong!" } = err;

    err.statusCode = statusCode;
    err.message = message;

    res.status(statusCode).render("error.ejs", { err });
});
app.listen(3000, () => {
    console.log("server running on port 3000");
});