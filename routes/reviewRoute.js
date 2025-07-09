const express = require('express');
const router = express.Router({ mergeParams: true });
const mongoose = require('mongoose');
const Review = require('../models/reviews.js'); // Ensure the path matches your project structure
const wrapAsync = require('../utilis/wrapAsync.js');
const ExpressError = require("../utilis/ExpressError.js");
const { reviewSchema } = require("../Schema.js");
const Listing = require('../models/listing.js');
const ReviewController = require('../controllers/reviews.js');
const { isLoggedIn, isReviewAuthor } = require('../middleware.js');



const validateReview = (req,res,next) =>{
    let{error} = reviewSchema.validate(req.body);
        if(error){
            let msg = error.details.map((el) => el.message).join(',');
            throw new ExpressError(400, msg);
        }
        else{
            next();
        }
}; 

// Reviews
// post Router
router.post("/:id/reviews", isLoggedIn,validateReview, wrapAsync(ReviewController.post)); ;

//delete review
router.delete('/:id/reviews/:reviewId', wrapAsync(ReviewController.delete));

module.exports = router;

