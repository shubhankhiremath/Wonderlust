const Listing = require('../models/listing');
const Review = require('../models/reviews');

module.exports.post = async (req, res) => {
    let listing =  await Listing.findById(req.params.id);
    let newReview = new Review(req.body.review);
    newReview.author = req.user._id;

    listing.reviews.push(newReview);

    await newReview.save();
    await listing.save();

    console.log("new review saved");
    req.flash('success', 'new review added successfully');
    res.redirect(`/listings/${listing._id}`);
};

module.exports.delete = async (req, res) => {
    let { id, reviewId } = req.params;
    
        await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
        
        // Delete the review document
        await Review.findByIdAndDelete(reviewId);
        req.flash('success', 'review deleted successfully');
        res.redirect(`/listings/${id}`); 
};