const sequelize = require('../config/database');
const Expense = require('../models/expense');
const User=require('../models/User')
const AWS=require('aws-sdk');
const Userservises=require('../servises/userservises')
const FileURL = require('../models/fileUrl');

const S3servises=require('../servises/S3sevises')


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
  const page = parseInt(req.query.page) || 1; // Current page, default to 1
  const perPage = parseInt(req.query.perPage) || 10; 
  
  try {
    const { count, rows: expenses } = await Expense.findAndCountAll({
      where: { UserId: userId },
      limit: perPage,
      offset: (page-1)*perPage,
    });

    const totalPages = Math.ceil(count / perPage);
    res.status(200).json({ expenses, totalPages});
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
exports.download=async(req,res)=>{
  const t = await sequelize.transaction();
  try{
    const userId=req.user.id;
    const expenses=await Expense.findAll({where:{UserId:userId}});
    //console.log(expenses);
    const stringifiedExpenses=JSON.stringify(expenses);
    const filename=`Expenses${userId}/${new Date()}.txt`;
    const fileUrl=await S3servises.uploadToS3(stringifiedExpenses, filename);
    await FileURL.create({ fileUrl, UserId: userId }, { transaction: t });

    await t.commit();
    res.status(200).json({fileUrl, sucess:true})
  }
  catch(err){
    await t.rollback();
       res.status(500).json({fileUrl:'',success:false,err:err});
  }
 // const expenses=await req.user.getExpenses();
  
}
exports.getDownloadHistory = async (req, res) => {
  const userId = req.user.id;
  try {
    const fileUrls = await FileURL.findAll({ where: { UserId: userId } });
    res.status(200).json({ fileUrls });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error fetching download history' });
  }
};

