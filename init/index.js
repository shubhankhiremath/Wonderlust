const mongoose = require('mongoose');
const initdata = require('./data');
const Listing = require('../models/listing');


main()
    .then((res) => {
                console.log("Connected to Mongo")})
    .catch((err) => {
                console.log(err)
    });

async function main() {
    await mongoose.connect('mongodb://127.0.0.1:27017/wonderlust');   
}

let db = async () => {
    await Listing.deleteMany({});
    initdata.data = initdata.data.map((obj) => ({
        ...obj,
        owner : '685ee0653e75d12d86c9ba0a'
    }));
    await Listing.insertMany(initdata.data);
    console.log("Sample listings saved to the database");
};

db()
    .then(() => {
        console.log("Database initialized with sample data");
        mongoose.connection.close();
    })
    .catch((err) => {
        console.error("Error initializing database:", err);
        mongoose.connection.close();
    });