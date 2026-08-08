const express = require("express");
const router = express.Router();

const Listing = require("../models/listing");
const ExpressError = require("../utils/ExpressError");
const wrapAsync = require("../utils/wrapAsync");
const { listingSchema } = require("../schema");
const { model, models } = require("mongoose");
const { isLoggedIn,isuser } = require("../middleware");

const validateListing = (req, res, next) => {

    const { error } = listingSchema.validate(req.body);

    if (error) {
        let errMsg = error.details.map((el) => el.message).join(",");
        throw new ExpressError(400, errMsg);
    }

    next();
};

router.get("/", wrapAsync(async (req, res) => {
    let alllistings = await Listing.find({});
    // console.log(alllistings);
    res.render("listings/index", { alllistings });
}));
//create a new post
router.get("/new",isLoggedIn ,(req,res)=>{
    res.render("listings/form.ejs");
})
//show route
router.get("/:id", wrapAsync(async (req, res) => {
    let { id } = req.params;
   
   let listing = await Listing.findById(id)
        .populate({
            path: "reviews",
            populate: {
                path: "author"
            }
        })
        .populate("owner");

    if (!listing) {
        req.flash("error", "The Listing Is Already Deleted");
        return res.redirect("/listing");
    }

    res.render("listings/show.ejs", { listing });
}));
//post the listing after create
// router.post("/listing",async (req,res)=>{
//     let{title,description,image,price,location,country}=req.body;
//     let newListing=new Listing({
//         title:title,
//         description:description,
//         image:image,
//         price:price,
//         location:location,
//         country:country,
//     })
//     await newListing.save();
//     console.log(newListing);
//     res.redirect("/listing");
// })

// router.post("/listing",async(req,res)=>{
//     let newListing=new Listing(req.body.listing);
//     await newListing.save();
//     res.redirect("/listing")
// })

router.post("/",isLoggedIn,validateListing,wrapAsync( async (req, res,next) => {
        req.body.listing.image = {
        filename: "listingimage",
        url: req.body.listing.image,
    };

    let newListing = new Listing(req.body.listing);
    newListing.owner = req.user._id;
    req.flash("success", "New Listing Created Successfully!");
    await newListing.save();
    res.redirect("/listing");
    
}));


//update the listing
//1st get
router.get("/:id/edit",isLoggedIn,isuser,async (req,res)=>{
    let {id}=req.params;
    let listing = await Listing.findById(id);
     if (!listing) {
        req.flash("error", "The Listing Is Already Deleted");
        return res.redirect("/listing");
    }
    res.render("listings/edit.ejs", { listing});
})
// router.put("/listing/:id",async(req,res)=>{
//     let {id}=req.params;
//     await Listing.findByIdAndUpdate(id,req.body.listing);
//     res.redirect(`/listing/${id}`);
// })

router.put("/:id", isLoggedIn,isuser,validateListing,async (req, res) => {
    let { id } = req.params;

    req.body.listing.image = {
        filename: "listingimage",
        url: req.body.listing.image,
    };
    

    await Listing.findByIdAndUpdate(id, req.body.listing);
    req.flash("success", "Listing Updated Successfully!");
    res.redirect(`/listing/${id}`);
});

router.delete("/:id", isLoggedIn,isuser ,async (req, res) => {

    let { id } = req.params;

    await Listing.findByIdAndDelete(id);
    req.flash("success", "Listing Deleted Successfully!");
    res.redirect("/listing");

});
module.exports = router;