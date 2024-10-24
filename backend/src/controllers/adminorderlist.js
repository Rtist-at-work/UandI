const express = require('express');
const router = express.Router();
const Order = require('../models/orderModel');


router.get('/', async (req, res) => {

    try {
        const orders = await Order.find();
        if (orders) {
            return res.json({ status: true, message: "Order list successfully fetched", orders });
        }
        return res.json({ status: false, message: "No orders found." });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ status: false, message: "An error occurred while fetching orders." });
    }
});



module.exports = router;
