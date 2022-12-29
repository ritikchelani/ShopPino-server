const User = require('../models/User');
const ErrorHandler=require('../utils/errorHandler');
const catchAsyncErrors=require('../middlewares/catchAsyncErrors');
const sendToken=require('../utils/jwtToken');
const sendEmail=require('../utils/sendEmail');
const crypto=require('crypto');



exports.registerUser = catchAsyncErrors(async(req,res,next) => {
    const {name,email,password}=req.body;
    const user=await User.create({
        name,
        email,
        password,
        avatar:{
            public_id:'kakvncla/afad',
            url:'jakbcsjcka.com'
        }
    })
    
    sendToken(user,201,res);

})
    
exports.loginUser = catchAsyncErrors(async(req,res,next) => {
    const { email, password } = req.body;

    // Checks if email and password is entered by user
    if (!email || !password) {
        return next(new ErrorHandler('Please enter email & password', 400))
    }

    // Finding user in database
    const user = await User.findOne({ email }).select('+password')

    if (!user) {
        return next(new ErrorHandler('Invalid Email or Password', 401));
    }

    // Checks if password is correct or not
    const isPasswordMatched = await user.comparePassword(password);

    if (!isPasswordMatched) {
        return next(new ErrorHandler('Invalid Email or Password', 401));
    }

    sendToken(user,200,res);
})


exports.forgotPassword = catchAsyncErrors(async(req, res, next)=>{
    const user=await User.findOne({email:req.body.email});

    if(!user){
        return next(new ErrorHandler('Invalid Email (user not found)', 404));
    }


    const resetToken=user.getResetPasswordToken();

    await user.save({validateBeforeSave:false})
    const resetUrl = `${req.protocol}://${req.get('host')}/password/reset/${resetToken}`;

    const message = `Your password reset token is as follow:\n\n${resetUrl}\n\nIf you have not requested this email, then ignore it.`


    try {
        await sendEmail({
            email:user.email,
            subject:'ShopPino (Password Reset)',
            message
        })

        res.status(200).json({
            success: true,
            message:`Email sent successfully to ${user.email}`
        })
        
    } catch (error) {
        user.resetPasswordToken=undefined;
        user.resetPasswordExpire=undefined;
        await user.save({validateBeforeSave:false})

        return next(new ErrorHandler(error.message,500));
    }

})


exports.resetPassword = catchAsyncErrors(async(req, res, next)=>{

    const resetPasswordToken=crypto.createHash('sha256').update(req.params.token).digest('hex');

    const user=await User.findOne({
        resetPasswordToken,
        resetPasswordExpire:{ $gt: Date.now()}
    })

    if(!user){
        return next(
            new ErrorHandler('Password reset token is invalid or Expired',400)
        );

    }

    if(req.body.password !== req.body.confirmPassword){
        return next(new ErrorHandler('Password Does not match',400));
    }

    user.password = req.body.password
    
    user.resetPasswordToken=undefined;
    user.resetPasswordExpire=undefined;

    await user.save();

    sendToken(user,200,res);

})


//get currently logged in user details
exports.getUserProfile = catchAsyncErrors(async (req, res,next) => {
    const user=await User.findById(req.user.id);

    res.status(200).json({
        success: true,
        user
    })
})


//Update Password
exports.updatePassword = catchAsyncErrors(async(req, res, next)=>{
    const user=await User.findById(req.user.id).select('+password');
    

    const isMatched=await user.comparePassword(req.body.oldPassword);

    if(!isMatched){
        return next(new ErrorHandler('Old password mismatch',400));
    }

    user.password = req.body.password;

    await user.save();

    sendToken(user,200,res);
})


//Update user profile
exports.updateProfile=catchAsyncErrors(async(req, res, next)=>{
    const newUserdata={
        name:req.body.name,
        email:req.body.email
    }

    //TO-DO
    // Update AVATAR
    //TO-DO

    const user=await User.findByIdAndUpdate(req.user.id,newUserdata,{
        new:true,
        runValidators:true,
        useFindAndModify:false
    })

    res.status(200).json({
        success: true
    })


})





exports.logoutUser=catchAsyncErrors(async(req,res,next) => {

    res.cookie('token',null,{
        expires: new Date(Date.now()),
        httpOnly:true
    })


    res.status(200).json({
        success: true,
        message:"Logged out successfully"
    })
})

//Admin routes
//get All Users

exports.allUsers=catchAsyncErrors(async(req,res,next)=>{
    const users=await User.find();

    res.status(200).json({
        success: true,
        count:users.length,
        users
    })
})


//get user details
exports.getUserDetails=catchAsyncErrors(async(req,res,next)=>{
    const user=await User.findById(req.params.id);

    if(!user){
        return next(new ErrorHandler(`User not found with id :${req.params.id}`,400));
    }    

    res.status(200).json({
        success: true,
        user
    })
})

exports.updateUser=catchAsyncErrors(async(req, res, next)=>{
    const newUserdata={
        name:req.body.name,
        email:req.body.email,
        role:req.body.role
    }
    const user=await User.findByIdAndUpdate(req.params.id,newUserdata,{
        new:true,
        runValidators:true,
        useFindAndModify:false
    })

    res.status(200).json({
        success: true
    })
})


//Delete User
exports.deleteUser=catchAsyncErrors(async(req,res,next)=>{
    const user=await User.findById(req.params.id);

    if(!user){
        return next(new ErrorHandler(`User not found with id :${req.params.id}`,400));
    }    

    //TODO
    //Remove avatar from cloudinary

    await user.remove();
    res.status(200).json({
        success: true
    })
})
