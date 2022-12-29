const User = require('../models/User');
const jwt = require('jsonwebtoken');
const ErrorHandler = require('../utils/errorHandler');
const catchAsyncErrors=require('./catchAsyncErrors');


exports.isAuthenticatedUser = catchAsyncErrors(async (req, res, next) => {
    const {token}=req.cookies;
    
    if(!token){
        return next(new ErrorHandler('Login Required',401));
    }

    const decoded=jwt.verify(token,process.env.JWT_SECRET);
    req.user=await User.findById(decoded.id);

    next();
})


exports.authorizeRoles=(...roles)=>{
    return (req,res,next)=>{
        if(!roles.includes(req.user.role)){ 
            return next(
            new ErrorHandler(`Role (${req.user.role}) is not allowed to access this resource`,403));
        }
        next();
    }
}