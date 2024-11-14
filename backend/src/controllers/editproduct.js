const express = require('express');
const router = express.Router();
const productForm = require('../models/productSchema');



router.put("/:id", async (req, res) => { 
    console.log("kjnfvjnv")

    const { id } = req.params;
    // const get = req.query.get;
    console.log(id)
    // console.log(get)
    try {
        const { name, price, category, description, offer, stock, sizes, style, images, colors } = req.body;

        await productForm.findByIdAndUpdate(id, {
            name,
            price,
            offer,
            stock,
            sizes,
            category,
            style,
            description,
            images,
            colors
        });

        return res.json({ status: true, message: "Product updated successfully" });
    } catch (err) {
        console.error(err);
        return res.json({ status: false, message: err.message });
    }
});
router.get('/getProducts',async(req,res)=>{
    
    const { editId } = req.query;
    try{
        const product = await productForm.findOne({id:editId});
        if(product){
            res.json({status:true,message:"product fetched successfully",product})
        }
    }
    catch(err){
        res.json({status:false,err});

    }
})
router.delete('/deleteProducts',async(req,res)=>{
    
    const { editId } = req.query;
    try{
        const product = await productForm.deleteOne({id:editId});
        if(product){
            res.json({status:true,message:"product deleted successfully"})
        }
    }
    catch(err){
        res.json({status:false,err});

    }
})

module.exports = router;
    