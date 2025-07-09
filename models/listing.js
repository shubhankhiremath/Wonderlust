const mongoose = require('mongoose');
const { listingSchema } = require('../Schema');
const Review = require('./reviews.js');

const { Schema } = mongoose;


const userSchema = new mongoose.Schema({
    title: {
        type :String,
        required: true
    },
    description : String,
    image :{

        url: String,
        filename: String,

    },
    price: Number,
    location: String,
    country : String,
    reviews : [
        {
            type : Schema.Types.ObjectId,
            ref : "Review",
        }
    ],
    owner : {
        type : Schema.Types.ObjectId,
        ref : "User",
        
    }
});

userSchema.post("findOneAndDelete", async(doc) => {
    if (doc) {

        await Review.deleteMany({_id: {$in: doc.reviews}});
    }
});

const Listing = mongoose.model('Listing', userSchema);
module.exports = Listing;