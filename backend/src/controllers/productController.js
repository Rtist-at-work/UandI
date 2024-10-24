const express = require('express');
const router = express.Router();
const productForm = require('../models/productSchema');
const { v4: uuidv4 } = require('uuid');
const path = require('path');
const multer = require('multer');
const upload = require('../../uploadProduct')


// Route for handling product upload
router.post('/', (req, res, next) => {
    upload.array('images', 10)(req, res, (err) => {
        // Handle multer errors for file upload
        if (err) {
            if (err.message === 'Give proper file format to upload') {
                return res.status(400).json({ error: err.message });
            }
            return res.status(500).json({ error: 'File upload failed' });
        }

        // Proceed to the next middleware if no errors
        next();
    });
}, async (req, res) => {
    try {
        const { name, price, category, description, offer, stock, sizes, style } = req.body;

        // Check if no files were uploaded
        if (!req.files || req.files.length === 0) {
            return res.status(400).json({ error: "No files uploaded" });
        }

        // Map file buffers to base64
        const images = req.files.map((file) => file.buffer.toString('base64'));

        // Create a new product with the provided data and images
        const product = new productForm({
            id: uuidv4(),
            name,
            price,
            offer,
            stock,
            sizes,
            category,
            style,
            description,
            images
        });

        // Save the product to the database
        const result = await product.save();
        res.status(201).json(result); // Respond with created product

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Something went wrong" });
    }
});

module.exports = router;
