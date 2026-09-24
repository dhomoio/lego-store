const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const Cart = require('../models/Cart');
const Product = require('../models/Product');
const { authMiddleware } = require('../middleware/auth');

router.post('/', authMiddleware, async (req, res, next) => {
  try {
    const cart = await Cart.findOne({ userId: req.user.userId }).populate('items.productId');
    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ error: 'Cart is empty' });
    }

    let totalAmount = 0;
    const items = cart.items.map(item => {
      const price = item.productId.price || 0;
      totalAmount += item.quantity * price;
      return {
        productId: item.productId._id,
        name: item.productId.name,
        quantity: item.quantity,
        price
      };
    });

    const order = new Order({
      userId: req.user.userId,
      items,
      totalAmount,
      status: 'paid'
    });

    await order.save();

    for (const item of cart.items) {
      await Product.findByIdAndUpdate(item.productId._id, { $inc: { stock: -item.quantity } });
    }

    cart.items = [];
    await cart.save();

    res.status(201).json(order);
  } catch (error) {
    next(error);
  }
});

router.get('/my-orders', authMiddleware, async (req, res, next) => {
  try {
    const orders = await Order.find({ userId: req.user.userId }).sort('-createdAt');
    res.json(orders);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
