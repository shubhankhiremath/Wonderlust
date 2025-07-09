const express = require("express");
const router = express.Router();
const wrapAsync = require("../utilis/wrapAsync.js");
const ExpressError = require("../utilis/ExpressError.js");
const { listingSchema, reviewSchema } = require("../Schema.js");
const Listing = require("../models/listing.js");
const reviewsRouter = require("./reviewRoute.js");
const Review = require("../models/reviews.js");
const { isLoggedIn, isOwner } = require("../middleware.js");
const ListingController = require("../controllers/listings.js");

const multer = require('multer');
const {storage } = require("../cloudConfig.js");
const upload = multer({ storage});

const validateListing = (req, res, next) => {
  let { error } = listingSchema.validate(req.body);
  if (error) {
    const msg = error.details.map((el) => el.message).join(",");
    throw new ExpressError(400, msg);
  } else {
    next();
  }
};

router
.route("/")
.get(wrapAsync(ListingController.index))  //index route
.post(      // create route
  isLoggedIn,
  
  // (req, res, next) => {
  //   // Extract the image URL before validation
  //   if (
  //     req.body.listing.image &&
  //     typeof req.body.listing.image === "object" &&
  //     req.body.listing.image.url
  //   ) {
  //     req.body.listing.image = req.body.listing.image.url;
  //   }
  //   next();
  // },
  upload.single("listing[image]"),
  validateListing,
  
  wrapAsync(ListingController.create)
);


//new route
router.get("/new", isLoggedIn, ListingController.new);

router
  .route("/:id")
  .get(ListingController.show) //Show route
  .put(   //Update Route
    isLoggedIn,
    isOwner,
    upload.single("listing[image]"),
    validateListing,
    wrapAsync(ListingController.update)
  )
  .delete(isLoggedIn, isOwner, wrapAsync(ListingController.delete)); // Delete Route


//Edit Route
router.get("/:id/edit", isLoggedIn, isOwner,upload.single("listing[image]"),wrapAsync(ListingController.edit));



module.exports = router;
