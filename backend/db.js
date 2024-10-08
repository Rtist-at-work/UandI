const mongoose = require('mongoose');
require('dotenv').config(); 


const connect = ()=>{
    const url = process.env.URL;
    console.log(url)
    try{
        mongoose.connect(url);
    }
    catch(err){
        console.log(err);
    }
}

module.exports = connect