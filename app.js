const dns = require("dns");

dns.setServers([
    "8.8.8.8",
    "1.1.1.1"
]);

require("dotenv").config();

const express = require("express");
const app = express();

const mongoose = require("mongoose");
const Listing = require("./models/listing.js");
const Review=require("./models/review.js");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const ExpressError = require("./utils/ExpressError");
const wrapAsync=require("./utils/wrapAsync.js");
const { listingSchema,reviewSchema } = require("./schema");
const listingRouter = require("./routes/listing");
const reviewRouter = require("./routes/review");
const session=require("express-session");
const MongoStore = require("connect-mongo").default;
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
    await mongoose.connect(process.env.ATLAS_URL);
}
console.log("Mongo URL exists:", !!process.env.ATLAS_URL);
main()
.then(() => {
    console.log("connected to db");
})
.catch((err) => {
    console.log(err);
});


const store = MongoStore.create({
    mongoUrl: process.env.ATLAS_URL,
    crypto: {
        secret: process.env.SECRET,
    },
    touchAfter: 24 * 3600,
});

store.on("error", () => {
    console.log("ERROR in MONGO SESSION STORE");
})

app.use(session({
    store,
    secret:process.env.SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: {
        expires: new Date(Date.now() + 1000 * 60 * 60 * 24),
        maxAge: 1000 * 60 * 60 * 24,
        httpOnly: true
    }
}));
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
    res.redirect("/listing");
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