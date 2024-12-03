const Razorpay = require('razorpay');
const Order = require('../models/order');
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const sequelize = require('../config/database');

exports.createOrder = async (req, res) => {
    const t = await sequelize.transaction();
    try {
      const user = await User.findByPk(req.user.id, { transaction: t });
      if (!user) {
        await t.rollback();
        return res.status(404).json({ message: 'User not found' });
      }
      const rzp = new Razorpay({
        key_id: process.env.RAZORPAY_KEY_ID,
        key_secret:process.env.RAZORPAY_KEY_SECRET,
      });
      const amount = 50000;
  
      rzp.orders.create({ amount, currency: "INR" }, async (err, order) => {
        if (err) {
          await t.rollback();
          return res.status(500).json({ message: 'Error creating order', error: err.message });
        }
  
        await user.createOrder({ orderid: order.id, status: 'PENDING' }, { transaction: t });
        await t.commit();
        return res.status(201).json({ order, key_id: rzp.key_id });
      });
    } catch (err) {
      await t.rollback();
      console.error("Unexpected error:", err);
      res.status(403).json({ message: 'Something went wrong', error: err });
    }
  };


exports.paymentWebhook = async (req, res) => {
  //console.log("Headers received:", req.headers);
  //console.log("Webhook received:", req.body);

  try {
      const { order_id, payment_id } = req.body;

      if (!order_id) {
          return res.status(400).json({ message: 'Invalid webhook payload: missing order_id' });
      }

      const order = await Order.findOne({ where: { orderid: order_id } });

      if (!order) {
          console.log("Order not found for order_id:", order_id);
          return res.status(404).json({ message: 'Order not found' });
      }

      // Simplified logic for testing
      const paymentStatus = payment_id ? 'SUCCESS' : 'FAILED';
       
      await order.update({
          status: paymentStatus,
          paymentid: payment_id || null,
      });
      if (paymentStatus === 'SUCCESS') {
        const user = await User.findByPk(order.UserId);
        const token = jwt.sign({ id: user.id, buyPremium: true }, process.env.JWT_SECRET);
        //console.log(token);
        return res.status(200).json({ message: 'Order successful', token });
    } else {
        return res.status(200).json({ message: 'Order failed' });
    } 
      console.log(`Order status updated to ${paymentStatus} for order_id:`, order_id);
      return res.status(200).json({ message: `Order status updated to ${paymentStatus}` });
  } catch (err) {
      console.error("Error processing payment webhook:", err);
      return res.status(500).json({ message: 'Internal server error', error: err.message });
  }
};
