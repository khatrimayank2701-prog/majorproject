const Listing=require("../models/listing");

module.exports.index = async (req, res) => {

    let { category,search } = req.query;
    
    let alllistings;

    if (category) {
        alllistings = await Listing.find({ category: category });
    } 
     else if (search) {

        alllistings = await Listing.find({
            $or: [
                { title: { $regex: search, $options: "i" } },
                { location: { $regex: search, $options: "i" } },
                { country: { $regex: search, $options: "i" } }
            ]
        });

    } 
    else {
        alllistings = await Listing.find({});
    }

    res.render("listings/index.ejs", { alllistings });
};
// module.exports.index=async (req, res) => {
//     let alllistings = await Listing.find({});
//     res.render("listings/index", { alllistings });
// };

module.exports.show=async (req, res) => {
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
}

module.exports.create=async (req, res,next) => {
    let url=req.file.path;
    let filename=req.file.filename;
    
    let newListing = new Listing(req.body.listing);
    newListing.owner = req.user._id;
    newListing.image = {url,filename};
    req.flash("success", "New Listing Created Successfully!");
    await newListing.save();
    res.redirect("/listing");
    
}
module.exports.edit=async (req,res)=>{
    let {id}=req.params;
    let listing = await Listing.findById(id);
     if (!listing) {
        req.flash("error", "The Listing Is Already Deleted");
        return res.redirect("/listing");
    }
    let originalimg = listing.image.url;

    originalimg = originalimg.replace(
        "/upload/",
        "/upload/w_250,e_blur:300,q_auto:low/"
    );
    res.render("listings/edit.ejs", { listing,originalimg});
}
module.exports.update=async (req, res) => {
    let { id } = req.params;
    let listing=await Listing.findByIdAndUpdate(id,req.body.listing,{ new: true });
    if(req.file){
    let url=req.file.path;
    let filename=req.file.filename;
    listing.image={url,filename};
    await listing.save();
    }
    req.flash("success", "Listing Updated Successfully!");
    res.redirect(`/listing/${id}`);
}
module.exports.delete=async (req, res) => {

    let { id } = req.params;

    await Listing.findByIdAndDelete(id);
    req.flash("success", "Listing Deleted Successfully!");
    res.redirect("/listing");

}