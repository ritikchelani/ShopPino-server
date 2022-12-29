const ErrorHandler=require('../utils/errorHandler');

module.exports = (err,req,res,next)=>{
    err.statusCode = err.statusCode || 500;

    if(process.env.NODE_ENV === 'DEVELOPMENT'){
        res.status(err.statusCode).json({
            success: false,
            error:err,
            errmessage:err.message,
            stack:err.stack
        })
    }
    else{
        let error={...err}
        error.message=err.message;

        //Wrong MongoDB ID Error
        if(err.name=='CastError'){
            const message=`Resource not found. Invalid: ${err.path}`;
            error=new ErrorHandler(message,404);
        }

        //Handling Mongoose validation errors 
        if(err.name==='ValidationError'){
            const message=Object.values(err.errors).map(value => value.message);
            error=new ErrorHandler(message,404);
        }


        //handling JWT validation errors
        if(err.code===11000){
            const message=`Duplicate ${Object.keys(err.keyValue)} entered`
            error=new ErrorHandler(message,404);
        }

        //Handling Wrong jwt validation errors
        if(err.name==='jsonwebtokenError'){
            const message="JWT is invalid, Try again!!!!"
            error=new ErrorHandler(message,404);
        }

        //Handling Expired jwt validation errors
        if(err.name==='TokenExpiredError'){
            const message="JWT is expired, Try again!!!!"
            error=new ErrorHandler(message,404);
        }



        
        res.status(error.statusCode).json({
            success: false,
            message:error.message || "Internal Server Error"
        })
    }
}