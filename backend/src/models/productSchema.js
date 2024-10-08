const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    id: {
        type: String,
        unique: true
    },
    name: {
        type: String
    },
    price: {
        type: Number,
        required: true,
        min: 0 // Ensure price is not negative
    },
    offer: {
        type: Number,
        min: 0, // Ensure offer is not negative
        default: 0 // Provide a default value
    },
    stock: {
        type: String,
        enum: ["In Stock", "Out Of Stock"], // Limit stock to specific values
        required: true
    },
    sizes: {
        type: [String]
    },
    category: {
        type: String
    },
    style: {
        type: String
    },
    description: {
        type: String
    },
    images: [String]
});

const productForm = mongoose.model('products', productSchema);
module.exports = productForm;
