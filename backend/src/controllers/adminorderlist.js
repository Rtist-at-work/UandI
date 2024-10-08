const express = require('express');
const router = express.Router();
const Order = require('../models/orderModel');
const usermodel = require('../models/usermodel')


router.get('/',async(req,res)=>{
    console.log("ok")
    try{
        const order = await Order.find();
        console.log(order)
        if(order){
            res.json({status:true,message:"orderList successfully fetched",order})
        }
    }
    catch(err){
        res.json({status:true,message:err.message});
    }    
})
router.put('/orderstatus', async (req, res) => {
    const { value, orderId, userId } = req.body;

    try {
        // Find the user by userId
        const user = await usermodel.findOne({ _id: userId });

        if (user) {
            // Filter the user's order history for the order with the specified orderId
            const order = user.orderHistory.find(order => order.orderId === orderId);

            // Check if the order exists
            if (order) {
                // Update the order status
                order.status = value;
                console.log(order);

                // Save the updated user object to the database
                await user.save();
            } else {
                console.log(`Order with ID ${orderId} not found in user's order history.`);
                return res.status(404).json({ status: false, message: "Order not found in user's order history." });
            }
        } else {
            console.log("User not found.");
            return res.status(404).json({ status: false, message: "User not found." });
        }

        // Find the order in the Order collection by orderId
        const orders = await Order.findOne({ orderId: orderId });

        if (!orders) {
            return res.status(404).json({ status: false, message: "Order not found." });
        }

        // Update the order status
        orders.status = value;
        await orders.save();

        // Respond with a success message
        res.status(200).json({ status: true, message: "Status updated successfully." });

    } catch (err) {
        console.error(err); // Log the error for debugging
        res.status(500).json({ status: false, message: "An error occurred while updating the status." });
    }
});

module.exports = router;