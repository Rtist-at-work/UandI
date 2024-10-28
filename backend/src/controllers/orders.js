const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../models/usermodel');
const Order = require('../models/orderModel');
const product = require('../models/productSchema')

const cookieParser = require('cookie-parser');
require('dotenv').config();

router.use(cookieParser());

router.post('/', async (req, res) => {
    const token = req.cookies.token;

    if (!token) {
        return res.status(401).json({ status: false, message: 'Token missing or invalid' });
    }

    try {
        const decoded = await jwt.verify(token, process.env.KEY);
        const { id } = decoded;

        if (!id) {
            return res.status(401).json({ status: false, message: "User not found. Please login to place order" });
        }

        const user = await User.findById(id);
        if (!user) {
            return res.status(401).json({ status: false, message: "User not found. Please login to place order" });
        }

        const { orderId, deliveryAddress, orderSummary, coupon, subTotal,paymentMethod } = req.body;

        if (!deliveryAddress || !Array.isArray(orderSummary) || orderSummary.length === 0) {
            return res.status(400).json({ status: false, message: "Invalid order data" });
        }
        const order = new Order({
            userId: id,
            orderId: orderId,
            product: orderSummary,
            price: subTotal,
            paymentMethod : paymentMethod,
            deliveryaddress: deliveryAddress,
            coupon: coupon || '', // Default to empty string if no coupon
            orderDate: Date.now(),
            status: "orderplaced",
        });

        await order.save();
        orderSummary.map((order)=>{
            console.log(order)
        })
        // Update user order history
        user.orderHistory.push({
            orderId: orderId,
            productDetails: orderSummary.map((order) => ({
                product: order.product,
                count: order.count,
                selectedSize: order.selectedSize
            })),
            price: subTotal,
            paymentMethod: paymentMethod,
            deliveryaddress: deliveryAddress,
            coupon: coupon || '',
            orderDate: Date.now(),
            status: "order placed"
        });
        

        // // Clear user's cart products
        user.cartProducts = []; // Assuming cartProducts is an array

        await user.save(); // Save the user instance

        return res.status(200).json({ status: true, message: "Order placed successfully" });
    } catch (error) {
        console.error("Error processing order:", error);
        return res.status(500).json({ status: false, message: "An error occurred", error: error.message });
    }
});
router.get('/orderId', async (req, res) => {
    const token = req.cookies.token;

    if (!token) {
        return res.status(401).json({ status: false, message: 'Token missing or invalid' });
    }

    try {
        const decoded = await jwt.verify(token, process.env.KEY);
        const { id } = decoded;

        if (!id) {
            return res.status(401).json({ status: false, message: "User not found. Please login to place order" });
        }

        const orderCount = await Order.countDocuments();

        return res.json({ status: true, message: "Fetched successfully", orderCount });

    } catch (err) {
        // Catch any errors related to token verification or order fetching
        console.error(err);
        return res.status(500).json({ status: false, message: "An error occurred", error: err.message });
    }
});
router.get('/orderDetails',async(req,res)=>{
    const orderId = req.query.orderId;
    const token = req.cookies.token;

    if (!token) {
        return res.status(401).json({ status: false, message: 'Token missing or invalid' });
    }

    try {
        const decoded = await jwt.verify(token, process.env.KEY);
        const { id } = decoded;
    
        if (!id) {
            return res.status(401).json({ status: false, message: "User not found. Please login to place order" });
        }
    
        const user = await User.findById(id);
        if (!user) {
            return res.status(401).json({ status: false, message: "User not found. Please login to place order" });
        }
    
        const products = await product.find(); // Ensure you await the product query
    
        const orders = user.orderHistory.map((order) => {
            // Get product details from each order
            let productDetails = order.productDetails;

            // Update product details with the full product info
            productDetails = productDetails.map((productDetail) => {
                productDetail.product = products.find(
                    (prod) => prod.id.toString()=== productDetail.product// Use toString() for comparison
                );

                return productDetail;
                
            });
            
            order.productDetails = productDetails;
            return(order);
        });
        if(orderId){
            const filteredOrder = orders.find((order)=>(order.orderId===orderId));
            return res.status(200).json({ status: true, filteredOrder });
        }
        const pd = orders.flatMap(order=>order.productDetails)
        console.log(pd);
        // Send the response with orders or further processing
        return res.status(200).json({ status: true, orders });
    
    } catch (error) {
        console.error("Error verifying token or fetching user:", error);
        return res.status(500).json({ status: false, message: "Internal server error" });
    }
    
})




module.exports = router;
