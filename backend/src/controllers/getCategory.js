const express = require('express');
const router = express.Router();
const categorymodel = require('../models/category');

router.get('/',async(req,res)=>{
    try{
        const category = await categorymodel.find();
        const categorynav = req.query.categorynav || "";
        const stylenav = req.query.stylenav || "";
        if(category && categorynav){
            
            const styleList = category.filter(                
                (category) => {                    
                    return(
                        category.category === categorynav
                    )
                }                
              );
            return res.json({category,styleList});            
            
        }
        
        else{
            return res.json(category);
        }

    }
    catch(err){
        console.log(err);
    }

}) 

module.exports = router 