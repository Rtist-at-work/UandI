const express = require('express');
const router = express.Router();
const categorymodel = require('../models/category');
const product = require('../models/productSchema')

router.get('/',async(req,res)=>{
    try{
        const category = await categorymodel.find();
        const categorynav = req.query.categorynav || "";
        const products = await product.find();
        if(category && categorynav){  
            const styleList = category.filter(                
                (category) => {  
                    return(
                       category.category.trim().toLowerCase() === categorynav.trim().toLowerCase()
                    )
                }                
              );
            return res.json({category,styleList});   
        }
        
        else{

            const catProducts = category
                    .map((cat) => {
                        const productWithOffer = products.find((product) => product.category === cat.category && product.offer > 0);
                        return productWithOffer || products.find((product) => product.category === cat.category) || null;
                    })
                    .filter(product => product !== null);
                    const f = catProducts.flatMap((prd)=>prd.images.flat()).flat()
                    console.log(f)
                    const bestsellers = await product
                .find({})
                .sort({ SalesPoints: -1 })
                .limit(7);

                const categories = await categorymodel.aggregate([
                    // Unwind the 'style' array to get individual style documents
                    { $unwind: "$style" },
              
                    // Unwind the 'sizes' array within each style
                    { $unwind: "$style.sizes" },
              
                    // Group by category, style, and collect sizes for each style
                    { $group: {
                      _id: { category: "$category", style: "$style.style" },
                      sizes: { $addToSet: "$style.sizes" }
                    } },
              
                    // Re-group by category to get the final structure
                    { $group: {
                      _id: "$_id.category",
                      styles: {
                        $push: {
                          style: "$_id.style",
                          sizes: "$sizes"
                        }
                      }
                    } },
              
                    // Project the category structure
                    { $project: {
                      _id: 0,
                      category: "$_id",
                      styles: 1
                    } }
                  ]);
              
                  // Format the data into the desired structure
                  const categoryData = categories.reduce((acc, category) => {
                    const sizes = category.styles.reduce((styleAcc, style) => {
                      styleAcc[style.style] = style.sizes;
                      return styleAcc;
                    }, {});
              
                    acc[category.category] = {
                      sizes: [...new Set(category.styles.flatMap(style => style.sizes))], // Combine all sizes for this category
                      styles: sizes
                    };
                    return acc;
                  }, {});



            return res.json({category,catProducts,bestsellers,categoryData});
        }

    }
    catch(err){
        console.log(err);
    }

}) 

module.exports = router 