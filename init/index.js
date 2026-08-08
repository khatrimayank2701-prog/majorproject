const mongoose = require("mongoose");
const Listing = require("../models/listing.js");//double dots
const initlisting=require("./data.js")
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
const initdb=async()=>{
    await Listing.deleteMany({});

      initlisting.listing = initlisting.listing.map((obj) => ({
        ...obj,
        owner: "6a741c629910b01f97dd14de",
    }));
    
    await Listing.insertMany(initlisting.listing);
    
  
    console.log("listing done");
}
initdb();
