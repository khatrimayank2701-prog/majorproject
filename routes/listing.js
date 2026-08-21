const express = require("express");
const router = express.Router();


const Listing = require("../models/listing");
const ExpressError = require("../utils/ExpressError");
const wrapAsync = require("../utils/wrapAsync");
const { listingSchema } = require("../schema");
const { model, models } = require("mongoose");
const { isLoggedIn,isuser,validateListing } = require("../middleware");
const Listingcontroller =require("../controllers/listing");
const multer = require("multer");
const { storage } = require("../cloudconfi");
const upload = multer({ storage });

router.route("/")
.get(wrapAsync(Listingcontroller.index))
.post(isLoggedIn,validateListing,upload.single('listing[image]'),wrapAsync(Listingcontroller.create));


router.get("/new",isLoggedIn ,(req,res)=>{
    res.render("listings/form.ejs");
})


router.route("/:id")
.get(wrapAsync(Listingcontroller.show))
.put(isLoggedIn,isuser,upload.single("listing[image]"),validateListing,wrapAsync(Listingcontroller.update))
.delete(isLoggedIn,isuser ,wrapAsync(Listingcontroller.delete));


router.get("/:id/edit",isLoggedIn,isuser,wrapAsync(Listingcontroller.edit));


module.exports = router;