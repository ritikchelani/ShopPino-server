const mongoose = require("mongoose");
const validator = require('validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto=require('crypto');



const UserSchema = new mongoose.Schema({
name:{
    type:String,
    required:[true,"Please enter your Name"],
    maxLength:[30,"Your Name must be in 30 characters"]
},
email:{
    type:String,
    required:[true,"Please enter your Email"],
    unique:true,
    validate:[validator.isEmail,"Please enter a valid email"]

},
password:{
    type:String,
    required:[true,"Please enter your Password"],
    minlength:[6,"Password must be at least 6 characters"],
    select:false
},
avatar:{
    public_id:{
        type:String,
        required:true,
    },
    url:{
        type:String,
        required:true
    }
},
role: {
    type:String,
    default:"user",
},
createdAt:{
    type:Date,
    default:Date.now
},
resetPasswordToken: String,

resetPasswordExpire: Date,

})

UserSchema.pre('save', async function(next){
    if(!this.isModified('password')){
        next();
    }

    this.password = await bcrypt.hash(this.password,10)
})


UserSchema.methods.comparePassword = async function(enteredPassword){
    return await bcrypt.compare(enteredPassword,this.password)
}


UserSchema.methods.getJwtToken=function(){
    return jwt.sign({id:this._id},process.env.JWT_SECRET,{
        expiresIn:process.env.JWT_EXPIRATION
    })
}

UserSchema.methods.getResetPasswordToken=function(){
    const resetToken=crypto.randomBytes(20).toString('hex');

    this.resetPasswordToken=crypto.createHash('sha256').update(resetToken).digest('hex');

    this.resetPasswordExpire=Date.now()+ 30 * 60 * 1000

    return resetToken;
}


const User=mongoose.model("User", UserSchema);

module.exports = User;