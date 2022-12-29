const express=require('express');
const app= express();
const cookieParser= require('cookie-parser');
const errorMiddleware= require('./middlewares/errors');

app.use(express.json());
app.use(cookieParser());

//routes
const products=require('./Routes/Product')
const auth=require('./Routes/auth')
const order=require('./Routes/order')



app.use('/api/v1',products);
app.use('/api/v1',auth);
app.use('/api/v1',order);


//Error Middleware
app.use(errorMiddleware);


module.exports = app;