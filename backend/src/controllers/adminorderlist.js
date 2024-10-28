const express = require('express');
const router = express.Router();
const Order = require('../models/orderModel');
const products = require('../models/productSchema');
const { ReturnDocument } = require('mongodb');


router.get('/', async (req, res) => {

    try {
        const orders = await Order.find();
        if (orders) {
            if (orders) {
                const updatedOrders = await Promise.all(orders.map(async (order) => {
            
                    const updatedProducts = await Promise.all(order.product.map(async (productId, index) => {
                        const pro = await products.findOne({ id: productId.product });
                        if (pro) {
                            order.product[index].product = pro;
                        }
                        return order.product[index];
                    }));
 
                    return { ...order.toObject(), product: updatedProducts };
                }));
            
                return res.json({ status: true, message: "Order list successfully fetched", orders: updatedOrders });
            }
            
        }
        return res.json({ status: false, message: "No orders found." });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ status: false, message: "An error occurred while fetching orders." });
    }
});



module.exports = router;
