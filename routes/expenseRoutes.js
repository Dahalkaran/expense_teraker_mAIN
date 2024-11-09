const express = require('express');
const path = require('path');
const expenseController = require('../controllers/expenseController');
const router = express.Router();

router.post('/expenses', expenseController.addExpense);
router.get('/expenses', expenseController.getExpenses);
router.get('/expenses/view', (req, res) => {
    res.sendFile(path.join(__dirname, '../views', 'expense.html'));
  });
  router.delete('/expenses/:id', expenseController.deleteExpense);
module.exports = router;