const express = require("express");
const Listing = require("../models/listing.js");
const wrapAsync = require("../utilis/wrapAsync.js");
const ExpressError = require("../utilis/ExpressError.js");
const Review = require("../models/reviews.js");
const { listingSchema } = require("../Schema.js");

module.exports.index = async (req, res) => {
  let listings = await Listing.find({});
  console.log("Sample listings saved to the database");
  res.render("listings/listing.ejs", { listings });
};

module.exports.new = (req, res) => {
  res.render("listings/newListing.ejs", { result: null });
};

module.exports.show = wrapAsync(async (req, res) => {
  const listingId = req.params.id;

  const listing = await Listing.findById(listingId)
    .populate({
      path: "reviews",
      populate: {
        path: "author",
      },
    })
    .populate("owner");
  if (!listing) {
    req.flash("error", "Listing not found");
    res.redirect("/listings");
  }
  console.log("Listing found:", listing);
  res.render(`listings/listingDetail`, { listing });
});

module.exports.create = async (req, res, next) => {
  let url = req.file.path;
  let filename = req.file.filename;
  console.log("File uploaded:", url, filename);
  const newlisting = new Listing(req.body.listing);
  // console.log(newlisting);
  newlisting.owner = req.user._id; // Set the owner to the current user
  newlisting.image = { url, filename }; // Set the image URL and filename
  
  await newlisting.save();
  req.flash("success", "Successfully created a new listing!");
  res.redirect("/listings");
};

module.exports.edit = async (req, res) => {
    const listingId = req.params.id;

    const listing = await Listing.findById(listingId);
    if (!listing) {
      req.flash("error", "Listing not found");
      res.redirect("/listings");
    }

    let originalImg = listing.image.url;
    originalImg = originalImg.replace("/upload" , "/upload/w_300,c_fill");
    res.render("listings/editListing.ejs", { listing, originalImg });
  };

module.exports.update = async (req, res) => {
  const listingId = req.params.id;
  const updatedListing = await Listing.findByIdAndUpdate(
    listingId,
    req.body.listing,
    { new: true }
  );
  
  if(typeof req.file !== "undefined" && req.file !== null) {
    let url = req.file.path;
    let filename = req.file.filename;
    updatedListing.image = { url, filename }; // Update the image URL and filename
    updatedListing.save();
  }

  if (!updatedListing) {
    return res.status(404).send("Listing not found");
  }
  req.flash("success", "Listing updated successfully! ");
  res.redirect(`/listings/${listingId}`);
};

module.exports.delete = async (req, res) => {
  const listingId = req.params.id;
  const deletedListing = await Listing.findByIdAndDelete(listingId);
  if (!deletedListing) {
    return res.status(404).send("Listing not found");
  }
  // Delete associated reviews

  console.log("Review before deleteMany:", Review);
  if (deletedListing.reviews) {
    await Review.deleteMany({ _id: { $in: deletedListing.reviews } });
  }
  req.flash("success", "Listing deleted successfully!");
  res.redirect("/listings");
};
