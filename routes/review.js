const express = require("express");
const router = express.Router({ mergeParams: true });

const Listing = require("../models/listing");
const Review = require("../models/review");
const ExpressError = require("../utils/ExpressError");
const wrapAsync = require("../utils/wrapAsync");
const { reviewSchema } = require("../schema");
const {isLoggedIn }=require("../middleware");
const {isAuthor,validateReview } = require("../middleware");
const Reviewcontroller =require("../controllers/review");

router.post("/",validateReview,isLoggedIn, wrapAsync(Reviewcontroller.postreview));

router.delete("/:reviewId",isLoggedIn,isAuthor, wrapAsync(Reviewcontroller.destroy));

module.exports = router;

// app.get("/listing", async (req, res) => {

//     let newlisting = new Listing({
//         title: "my new house",
//         description: "by the beach",
//         price: 12000,
//         location: "uttrakhand",
//         country: "india",
//     });

//     await newlisting.save();

//     console.log("saved");

//     res.send("saved successfully");
// });