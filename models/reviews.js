const { string, number } = require('joi');
const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const reviewSchema = new Schema({
    comment : String,
    rating : {
        type : Number,
        min : 1,
        Max : 5
    },
    author: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    createdAt : {
        type : Date,
        default : Date.now()
    }
});

module.exports = mongoose.model("Review",reviewSchema);