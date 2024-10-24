const express = require('express');
const app = express();
const jwt = require("jsonwebtoken");
const cookieParser = require('cookie-parser')
require('dotenv').config();

app.use(cookieParser());

const router = express.Router();

const verifyauth = async(req,res,next)=>{
    try{
        console.log(req.cookies);
        const token = req.cookies.token;
        if(!token){
            return res.json({status:false,message:"no token"});
            
        }
        const decoded = await jwt.verify(token,process.env.KEY);

        next()
    }
    catch(err){
        console.log(err);
    }
}
router.get('/',verifyauth,async(req,res)=>{

    return res.json({status:true, message:"authorized"})    
    
})

module.exports = router;
