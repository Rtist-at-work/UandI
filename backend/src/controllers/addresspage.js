const express = require('express');
const jwt = require('jsonwebtoken');
require('dotenv').config();
const usermodel = require('../models/usermodel'); 
const router = express.Router();

router.get('/',async(req,res)=>{
    const token = req.cookies.token;

  if (!token) {
    return res.status(401).json({ message: 'Token missing or invalid' });
}
    try{
        const decoded = await jwt.verify(token, process.env.KEY);
        const { id } = decoded;
        console.log(id)
        const user = await usermodel.findById(id);
        res.json(user.addresses)
    }
    catch(err){
       res.json(err);
    }
})

module.exports = router;