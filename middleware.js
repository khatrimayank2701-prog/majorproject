const Listing=require("./models/listing");
const Review=require("./models/review");
module.exports.isLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {
        req.session.geturl = req.originalUrl;
        req.flash("error", "You must be logged in first!");
        return res.redirect("/login");
    }

    next();
};
module.exports.saveurl = (req, res, next) => {

    if (req.session.geturl) {

        res.locals.saveurl =
            req.session.geturl;

        delete req.session.geturl;
    }

    next();
};


module.exports.isuser=async(req,res,next)=>{
    let {id}=req.params;
    let listing=await Listing.findById(id);
        if(!listing.owner.equals(res.locals.currUser._id)){
            req.flash("error","You dont have the authority of this account");
           return res.redirect(`/listing/${id}`);
        }
    next();
}

module.exports.isAuthor = async (req, res, next) => {
    let { reviewId, id } = req.params;

    let review = await Review.findById(reviewId);

    if (!review.author.equals(res.locals.currUser._id)) {
        req.flash("error", "You dont have the authority to do that");
        return res.redirect(`/listing/${id}`);
    }

    next();
};