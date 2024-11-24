const express = require('express');
const orderRouter = express.Router();
const { Order } = require('../model/order');

orderRouter.get('/', async (req, res) => {
    try {
        const orders = await Order.find();
        res.status(200).json(orders);
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error fetching orders', error: error.message });
    }
});

module.exports = orderRouter;
