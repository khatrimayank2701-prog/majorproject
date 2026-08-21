const mongoose = require("mongoose");

const listingSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },

    description: String,

    image: {
        filename: String,
        url: String,
    },

    price: Number,
    location: String,
    country: String,

    reviews: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Review",
        }
    ],
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    },
     category: {
        type: String,
        enum: [
            "Trending",
            "Rooms",
            "Beach",
            "Popular Cities",
            "Amazing Views",
            "Farms",
            "Lakefront",
            "Skiing",
            "Forest",
            "Cabins"
        ]
    }
});

const Listing = mongoose.model("Listing", listingSchema);

module.exports = Listing;