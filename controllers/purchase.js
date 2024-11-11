const Razorpay = require('razorpay');
const Order = require('../models/order');
const User = require('../models/User');

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
