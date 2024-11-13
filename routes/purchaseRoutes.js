const express = require('express');
const router = express.Router();
const authenticateToken = require('../middleware/authMiddleware');
const purchaseController = require('../controllers/purchase');

router.get('/create_order', authenticateToken, purchaseController.createOrder);
router.post('/payment/webhook',authenticateToken, purchaseController.paymentWebhook);

module.exports = router;
