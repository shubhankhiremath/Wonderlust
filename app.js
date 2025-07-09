if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config();
}
const express = require('express');
const app = express();
const mongoose = require('mongoose');
const ExpressError = require('./utilis/ExpressError.js'); // Custom error handling
const path = require('path'); // For handling file paths
const methodOverride = require('method-override'); 
const ejsmate = require('ejs-mate'); // For using EJS as the template engine
const listings = require('./routes/listingRoute.js'); // Import the listings route
// In routes/review.js
const Review = require("./models/reviews.js"); // Import the Review model

const session = require('express-session'); // For session management
const MongoStore = require('connect-mongo'); // For storing sessions in MongoDB
const flash = require('connect-flash'); // For flash messages
const passport = require('passport'); // For authentication
const LocalStrategy = require('passport-local'); // For local authentication strategy
const User = require('./models/user.js'); // Import the User model



app.use(methodOverride('_method')); 
const port = 3000;

app.use(express.urlencoded({ extended: true }));
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, "views"));
app.engine('ejs', ejsmate); // Use ejs-mate for EJS rendering
app.use(express.static(path.join(__dirname, 'public'))); // Serve static files from the 'public' directory


const dbUrl = process.env.ATLASDB_URL;


main()
	.then((res) => {
				console.log("Connected to Mongo")})
	.catch((err) => {
				console.log(err)
    });

async function main() {
	await mongoose.connect(dbUrl);   
}



const store = MongoStore.create({
    mongoUrl: dbUrl, // Use the same MongoDB URL as your database connection
    crypto : {
        secret: process.env.SECRET // Use the secret from your environment variables
    },
    touchAfter: 24 * 3600, // Update session after 24 hours
});


const sessionOptions = {
    store,
    secret: process.env.SECRET, // Use the secret from your environment variables
    resave: false,
    saveUninitialized: true,
    cookie: {
        expires: new Date(Date.now() + 24 * 7 * 60 * 60 * 1000), // Set cookie expiration to 1 week
        httpOnly: true, // Prevents client-side JavaScript from accessing the cookie
        maxAge: 24 * 7 * 60 * 60 * 1000 // Session expires after 1 day
    }
};

store.on("error", () => {
    console.log("Error in MongoStore session storage",err);
});



app.use(session(sessionOptions)); // Use session middleware
app.use(flash()); // Use flash middleware

app.use(passport.initialize()); // Initialize passport
app.use(passport.session()); // Use passport session
passport.use(new LocalStrategy(User.authenticate())); // Use local strategy for authentication
passport.serializeUser(User.serializeUser()); // Serialize user for session
passport.deserializeUser(User.deserializeUser()); // Deserialize user from session

app.use((req, res, next) => {
    res.locals.success = req.flash('success'); // Make flash messages available in views
    res.locals.error = req.flash('error'); 
    res.locals.currentUser = req.user; 
    next();
}); 

app.get("/demouser", async(req, res) => {
    let fakeUser = new User({ 
        email : "student21@gmail.com",
        username: "student21",
    });
    let registeredUser = await User.register(fakeUser, "passwordHello");
    res.send(registeredUser);
    
}); 






// Listings Routes
app.use('/listings', require("./routes/listingRoute.js")); // Use the listings route

app.use('/listings', require("./routes/reviewRoute.js"));
app.use("/" , require("./routes/userRoute.js")); // Use the user route




app.all('*', (req, res,next) => {
    next(new ExpressError(404, "Page Not Found!"));
});

//Error handling........
app.use((err,req,res,next) => {
    let {statuscode =500 , message = "Something went Wrong!"} = err;
    res.status(statuscode).render("error.ejs" ,{message});
    console.log(message);
    
});


app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});