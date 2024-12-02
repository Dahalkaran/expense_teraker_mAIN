const express = require('express');
const path = require('path');
const expenseController = require('../controllers/expenseController');
const router = express.Router();
const authenticateToken = require('../middleware/authMiddleware');
router.post('/expenses',authenticateToken, expenseController.addExpense);
router.get('/expenses', authenticateToken, expenseController.getExpenses);
router.get('/expenses/view', (req, res) => {
    res.sendFile(path.join(__dirname, '../views', 'expense.html'));
  });
  router.delete('/expenses/:id',authenticateToken, expenseController.deleteExpense);
 router.get('/expenses/download',authenticateToken,expenseController.download) 
 router.get('/expenses/download/history', authenticateToken, expenseController.getDownloadHistory);
 module.exports = router;