const express = require('express');
const {
  addExpense,
  getExpenses,
  updateExpense,
  deleteExpense,
} = require('../controllers/expenseController');
const authenticate = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/', authenticate, addExpense);
router.get('/', authenticate, getExpenses);
router.put('/:id', authenticate, updateExpense);
router.delete('/:id', authenticate, deleteExpense);

module.exports = router;