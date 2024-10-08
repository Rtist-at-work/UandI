const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../models/usermodel');
const Order = require('../models/orderModel');

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

        // Ensure deliveryAddress and orderSummary are present
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
            status: "order placed"
        });

        await order.save();

        // Update user order history
        user.orderHistory.push({
            orderId: orderId,
            product: orderSummary,
            price: subTotal,
            paymentMethod : paymentMethod,
            deliveryaddress: deliveryAddress,
            coupon: coupon || '',
            orderDate: Date.now(),
            status: "order placed"
        });

        // Clear user's cart products
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

        res.status(200).json({status:true,message:"order fetched successfully",orders : user.orderHistory});
    }
    catch(err){
        res.json(err);
    }

})



module.exports = router;
