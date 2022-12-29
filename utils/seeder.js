const Product = require('../Models/Product');
const dotenv = require('dotenv');

const connectdb=require("../config/db");

const products=require('../data/product');

//env settings
dotenv.config({path: '../config/config.env'});

connectdb();


const seedProducts=async()=>{
    try{
        await Product.deleteMany();
        console.log('Products deleted successfully');
        await Product.insertMany(products);
        console.log("All Products Are Added");
        process.exit();
    }catch(e){
        console.log(e.message);
        process.exit();
    }
}

seedProducts();