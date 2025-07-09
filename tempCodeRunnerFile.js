const validateListing = (req,res,next) =>{
    let{error} = listingSchema.validate(req.body);
        if(error){
            const msg = error.details.map(el => el.message).join(',');
            throw new ExpressError(400, msg);
        }
        else{
            next();
        }
}; 