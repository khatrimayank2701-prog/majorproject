const express = require("express");
const router = express.Router({ mergeParams: true });

const Listing = require("../models/listing");
const Review = require("../models/review");
const ExpressError = require("../utils/ExpressError");
const wrapAsync = require("../utils/wrapAsync");
const { reviewSchema } = require("../schema");
const {isLoggedIn }=require("../middleware");
const {isAuthor } = require("../middleware");

const validateReview = (req, res, next) => {

    const { error } = reviewSchema.validate(req.body);

    if (error) {
        let errMsg = error.details.map((el) => el.message).join(",");
        throw new ExpressError(400, errMsg);
    }

    next();
};
router.post("/",validateReview,isLoggedIn, wrapAsync(async (req, res) => {

    let listing = await Listing.findById(req.params.id);

    let newReview = new Review(req.body.review);
    newReview.author=req.user._id;
    listing.reviews.push(newReview);

    await newReview.save();
    await listing.save();
    req.flash("success", "Review Added Successfully!");
    res.redirect(`/listing/${listing._id}`);
}));

router.delete("/:reviewId",isLoggedIn,isAuthor, async (req, res) => {

    let { id, reviewId } = req.params;

    // Remove review ID from listing
    await Listing.findByIdAndUpdate(id, {
        $pull: { reviews: reviewId }
    });

    // Delete review document
    await Review.findByIdAndDelete(reviewId);
    req.flash("success", "Review Deleted Successfully!");
    res.redirect(`/listing/${id}`);
});
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