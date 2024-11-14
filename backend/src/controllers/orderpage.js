const express = require('express');
const router = express.Router();
const usermodel =require("../models/usermodel")
const product = require("../models/productSchema")
const jwt = require('jsonwebtoken');

//kbshb
router.get('/address',async(req,res)=>{
    const token = req.cookies.token;

    if(!token){
        return res.status(401).json({ message: 'Access denied. No token provided.' });
    }

    const decoded = jwt.verify(token, process.env.KEY);
    const {id} = decoded;
    try{
       
        const user = await usermodel.findById(id);
        if(user){ 
            return res.json({address : user.addresses,coupons : user.coupons});            
        }
    }
    catch(err){
        console.log(err);
    }

}) 
router.get('/productDetails',async(req,res)=>{
    const token = req.cookies.token
    if(!token){
        return res.status(401).json({ message: 'Access denied. No token provided.' });
    }
    const decoded = jwt.verify(token, process.env.KEY);
    const {id} = decoded;
    try{
       
        const user = await usermodel.findById(id);
        if(user){ 
            const productList = await product.find();
            const cart = user.cartProducts
            .map((cp) => {
                const product = productList.find((product) => cp.product === product.id);
                if (product) {
                    c = {
                        product : product,
                        count :cp.count,
                        selectedSize : cp.selectedSize
                    }                    
                    return c
                }
                return null;
            }).filter((cp) => cp !== null);
            
            return res.json({
                cart,
                productDetails: user.cartProducts
              });
                         
        }
    }
    catch(err){
        console.log(err);
    }

})

module.exports = router 