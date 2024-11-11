const Expense = require('../models/expense');

exports.addExpense = async (req, res) => {
  const { amount, description, category } = req.body;
  const userId = req.user.id; // Get user ID from JWT payload

  try {
    // Create a new expense associated with the authenticated user
    const expense = await Expense.create({ 
      amount, 
      description, 
      category,
      UserId: userId // Use the correct field name
    });;
    res.status(201).json(expense);
  } catch (error) {
    console.error('Error adding expense:', error);
    res.status(500).json({ message: 'Error adding expense' });
  }
};


exports.getExpenses = async (req, res) => {
  const userId = req.user.id; // Get user ID from JWT payload

  try {
    // Fetch only the expenses belonging to the authenticated user
    const expenses = await Expense.findAll({ where: { UserId: userId } });
    res.status(200).json(expenses);
  } catch (error) {
    console.error('Error fetching expenses:', error);
    res.status(500).json({ message: 'Error fetching expenses' });
  }
};

exports.deleteExpense = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await Expense.destroy({ where: { id } });
    if (result) {
      res.status(200).json({ message: 'Expense deleted successfully' });
    } else {
      res.status(404).json({ message: 'Expense not found' });
    }
  } catch (error) {
    console.error('Error deleting expense:', error);
    res.status(500).json({ message: 'Error deleting expense' });
  }
};