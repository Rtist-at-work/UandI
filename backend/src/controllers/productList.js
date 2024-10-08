const express = require('express');
const router = express.Router();
const productForm = require('../models/productSchema');

router.get('/',async(req,res)=>{
    try{
        const product = await productForm.find();
        const {stylenav} = req.query;
        
         if(product && stylenav){
            const filteredProduct = product.filter(                
                (product) => {                    
                    return(
                        product.style === stylenav
                    )
                }                
              );
            return res.json(filteredProduct);   

        }
        else{ 
            return res.json(product);  
        }
    }
    catch(err){
        console.log(err);
    }

}) 

module.exports = router 