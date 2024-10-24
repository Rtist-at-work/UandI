const express = require('express');
const router = express.Router();
const productForm = require('../models/productSchema');
const user = require('../models/usermodel');

router.get('/', async (req, res) => {
    try {
        const products = await productForm.find();
        const users = await user.find();
        const productId = req.query.productDetails;
        let reviews = [];

        products.map((product) => {
            let count = 0;

            // Ensure product.review exists, or initialize it
            if (!product.review) {
                product.review = {
                    text: [],
                    image: [],
                    stars: 0
                };
            }
            let stars = [];
            // Collect stars for each product based on user orders
            users.flatMap((user) => {
                return user.orderHistory
                    .filter(order =>( 
                        (order.productDetails).map((products)=>{
                        if(products.product  === product.id){
                            if ( product.id === productId) {
                                if (products.review && products.review.stars) {
                                    let arr = {
                                        stars: products.review.stars || 0,
                                        text: products.review.text || null,
                                        image: products.review.image || null,
                                        username: user.personalInfo.username
                                    };
                                    reviews.push(arr); // Push the review to the array
                                }
                            }
                            
                            products.review ? stars.push(products.review.stars) : stars.push(undefined) ;
                            
                        }}))
                    
                    )   
            }).filter(star => star !== undefined); // Filter out undefined stars
            const total = stars.reduce((acc, curr) => {
                if (curr > 0) {
                    count++;
                }
                return acc + curr;
            }, 0);

            if (total === 0 && count === 0) {
                product.review.stars = 0;
            } else {
                product.review.stars = total / count;
            }
        });

        // If productId exists, return that product and its reviews, else return all products
        if (productId) {
            const filteredProduct = products.find(p => p.id === productId);
            console.log(reviews)
            return res.json({ product: filteredProduct, reviews });
        }

        return res.json(products);
    } catch (err) {
        console.log(err);
        res.status(500).send('Server Error');
    }
});

module.exports = router;
