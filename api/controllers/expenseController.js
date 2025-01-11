const Expense = require('../models/Expense');

exports.addExpense = async (req, res) => {
  const { amount, category, description, date } = req.body;

  const expense = new Expense({
    userId: req.user._id,
    amount,
    category,
    description,
    date,
  });

  try {
    await expense.save();
    res.status(201).send(expense);
  } catch (err) {
    res.status(400).send(err.message);
  }
};

exports.getExpenses = async (req, res) => {
  try {
    const expenses = await Expense.find({ userId: req.user._id });
    res.status(200).send(expenses);
  } catch (err) {
    res.status(400).send(err.message);
  }
};


exports.updateExpense = async (req, res) => {
  try {
    const updatedExpense = await Expense.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.status(200).send(updatedExpense);
  } catch (err) {
    res.status(400).send(err.message);
  }
};


exports.deleteExpense = async (req, res) => {
  try {
    await Expense.findByIdAndDelete(req.params.id);
    res.status(200 ).send('Expense deleted');
  } catch (err) {
    res.status(400).send(err.message);
  }
};