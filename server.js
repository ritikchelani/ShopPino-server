const app=require('./app')
const dotenv=require('dotenv');
const connectdb=require('./config/db');


dotenv.config({path: './config/config.env'})

//uncaught exceptions
process.on('uncaughtException',err => {
    console.log(`Error: ${err.message}`);
    console.log("Shutting down the server Because of uncaught exception");
    process.exit(1);
})


//DATABASE CONNECTION
connectdb();


const server=app.listen(process.env.PORT,()=>{
    console.log(`Server listening on ${process.env.PORT} in ${process.env.NODE_ENV} mode.`)
})


process.on('unhandledRejection',err=>{
    console.log(`Error: ${err.stack}`);
    console.log("Shutting down the server Because of unhandled promise rejection");
    server.close(()=>{
        process.exit(1);
    });
})