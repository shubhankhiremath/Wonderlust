const User = require("../models/user"); // <-- Add this line at the top



module.exports.signup = (req,res) => {
    res.render("users/signup");
};

module.exports.SignupForm = async(req,res,next) => {
    const {username, email, password} = req.body;
    try {
        const newUser = new User({ 
            username: username,
            email: email
        });
        let registeredUser = await User.register(newUser, password);
        console.log(registeredUser);
        req.login(registeredUser, (err) => {
            if (err) {
                console.error(err);
                return next(err); // Pass the error to the next middleware
            }
            
            console.log("User logged in successfully");
            req.flash('success', 'Registration successful!'); // Flash success message
            res.redirect("/listings");
        });

        
    } catch (error) {
        console.error( error);
        req.flash('error', error.message); // Flash error message
        res.redirect("/signup");
    }
};

module.exports.login = (req, res) => {
    res.render("users/login");
}

module.exports.LoginForm = async(req, res) => {
        const { username } = req.body;
        req.flash('success', `Welcome back, ${username}!`); // Flash success message
        res.redirect(res.locals.redirectUrl || '/listings'); // Redirect to the original URL or default
        delete req.session.redirectUrl; // Clear the redirect URL after use
};

module.exports.logout = (req, res,next ) => {
    req.logout((err) => {
        console.log(err);
        if (err) {
            req.flash('error', 'Logout failed. Please try again.'); // Flash error message
            return next(err); // Pass the error to the next middleware
        }
        req.flash('success', 'Logged out successfully!'); // Flash success message
        res.redirect('/listings');
    });
};