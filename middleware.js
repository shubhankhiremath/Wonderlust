const Listing = require('./models/listing'); // Assuming you have a Listing model
const User = require('./models/user'); // Assuming you have a User model

module.exports.isLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {
        req.session.redirectUrl = req.originalUrl; // Store the original URL
        req.flash('error', 'You must be logged in to do that');
        return res.redirect('/login');
    }
    next();
}

module.exports.savedredirectUrl = (req, res, next) => {
    if (req.session.redirectUrl) {
        res.locals.redirectUrl = req.session.redirectUrl; // Make the redirect URL available in views
    }
    next();
}

module.exports.isOwner = async(req, res, next) => {
    
    const listingId = req.params.id;
    let listing = await Listing.findById(listingId);
    if (!listing.owner._id.equals(res.locals.currentUser._id)) {
        req.flash('error', 'You are not owner of this listing');
        return res.redirect(`/listings/${listingId}`);
    }
    next();
}