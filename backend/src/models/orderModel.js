const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    userId : {
        type: String,
    },
    orderId: {
        type: String,
        unique: true
    },
    product: [Object],
    price : Number,
    paymentMethod : String,
    deliveryaddress : Object,
    coupon : String,
    orderDate: { type: Date, default: Date.now },
    status: String
});

const ordermodel = mongoose.model("Orders", orderSchema);
module.exports = ordermodel;