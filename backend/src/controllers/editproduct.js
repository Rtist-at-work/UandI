const express = require('express');
const router = express.Router();
const multer = require('multer');
const productForm = require('../models/productSchema');

// Set up multer
const storage = multer.memoryStorage();
const upload = multer();

// Use multer middleware in the route
router.put("/:id", upload.none(), async (req, res) => { // Use .none() if you don't expect files
    const { id } = req.params;

    try {
        const { name, price, category, description, offer, stock, sizes, style, images } = req.body;

        console.log(req.body); // Check the entire req.body to debug
        console.log(images); // Log images to see if they come through

        await productForm.findByIdAndUpdate(id, {
            name,
            price,
            offer,
            stock,
            sizes,
            category,
            style,
            description,
            images // Use the Base64 images directly
        });

        return res.json({ status: true, message: "Product updated successfully" });
    } catch (err) {
        console.error(err);
        return res.json({ status: false, message: err.message });
    }
});

module.exports = router;
    