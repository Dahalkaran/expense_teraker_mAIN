const Razorpay = require('razorpay');
const Order = require('../models/order');
const User = require('../models/User');
const jwt = require('jsonwebtoken');
exports.createOrder = async (req, res) => {
    try {
        // Find the user instance using Sequelize
        const user = await User.findByPk(req.user.id); 
        
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Initialize Razorpay
        const rzp = new Razorpay({
            key_id: 'rzp_test_FZvOflrYZjXxJ6',
            key_secret: '1S0HNmtW0S45amqOm8ViOWFF'
        });

        const amount = 50000;

        // Create an order on Razorpay
        rzp.orders.create({ amount, currency: "INR" }, (err, order) => {
            if (err) {
                console.error("Error creating Razorpay order:", err);
                return res.status(500).json({ message: 'Error creating order', error: err.message });
            }

            // Use the Sequelize user instance to create the order in the database
            user.createOrder({ orderid: order.id, status: 'PENDING' })
                .then(() => {
                    return res.status(201).json({ order, key_id: rzp.key_id });
                })
                .catch(err => {
                    console.error("Error creating order in database:", err);
                    return res.status(500).json({ message: 'Error saving order in database', error: err.message });
                });
        });
    } catch (err) {
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
        const token = jwt.sign({ id: user.id, buyPremium: true }, 'ykjdsivjnsnvhjcsbnvhjscbivnsxkjvnxkjcvnskjxjnvkjxncvkjnkjvncxnv');
        console.log(token);
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
