const mongoose = require('mongoose');

const connectdb=()=>{
    mongoose.connect("mongodb://localhost:27017/ShopPino",{ useNewUrlParser: true }).then(con=>{
        console.log(`MONGODB Database Connection Successfull with HOST ${con.connection.host}`)
    })

    
}

module.exports=connectdb;