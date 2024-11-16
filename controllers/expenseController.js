const sequelize = require('../config/database');
const Expense = require('../models/expense');
const User=require('../models/User')
exports.addExpense = async (req, res) => {
  const { amount, description, category } = req.body;
  const userId = req.user.id;

  // Start a transaction without await
  const t = await sequelize.transaction();
try {
  const expense = await Expense.create(
    { amount, description, category, UserId: userId },
    { transaction: t }
  );

  const user = await User.findByPk(userId, { transaction: t });
  user.totalSpent += Number(amount);
  await user.save({ transaction: t });

  await t.commit(); // All operations succeeded, so commit the transaction
  res.status(201).json(expense);
} catch (error) {
  await t.rollback(); // An error occurred, so rollback the transaction
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
  const userId = req.user.id;

  // Start a transaction for deleting an expense and updating totalSpent
  const t = await sequelize.transaction();

  try {
    // Find the expense to be deleted
    const expense = await Expense.findOne({ where: { id, UserId: userId }, transaction: t });

    if (!expense) {
      // Rollback transaction and respond if expense not found
      await t.rollback();
      return res.status(404).json({ message: 'Expense not found' });
    }

    // Find the user and subtract the expense amount from totalSpent
    const user = await User.findByPk(userId, { transaction: t });
    user.totalSpent -= Number(expense.amount);
    await user.save({ transaction: t });

    // Delete the expense within the transaction
    await Expense.destroy({ where: { id }, transaction: t });

    // Commit the transaction if all operations succeed
    await t.commit();
    res.status(200).json({ message: 'Expense deleted successfully' });
  } catch (error) {
    // Rollback the transaction if an error occurs
    await t.rollback();
    console.error('Error deleting expense:', error);
    res.status(500).json({ message: 'Error deleting expense' });
  }
};