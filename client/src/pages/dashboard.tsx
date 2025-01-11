import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Modal from '../components/modal';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  MoreVertical, Edit, Trash2, Plus, 
  DollarSign, Calendar, PieChart as PieChartIcon,
  Target, ArrowUpRight, ArrowDownRight, Wallet
} from "lucide-react";
import { 
  PieChart, Pie, Cell, ResponsiveContainer, Line,
  CartesianGrid, XAxis, YAxis, Tooltip, Legend,
  Area, ComposedChart
} from 'recharts';

interface Expense {
  _id: string;
  amount: number;
  category: string;
  description: string;
  date: string;
}

interface DashboardProps {
  token: string;
}

export const Dashboard: React.FC<DashboardProps> = ({ token }) => {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [categories] = useState<string[]>([
    "Food", "Transport", "Utilities", "Entertainment", "Healthcare",
    "Education", "Rent", "Insurance", "Shopping"
  ]);
  const [newExpense, setNewExpense] = useState<Expense>({
    _id: '',
    amount: 0,
    category: '',
    description: '',
    date: new Date().toISOString().split('T')[0]
  });
  const [editingExpense, setEditingExpense] = useState<Expense | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState<boolean>(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState<boolean>(false);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState<boolean>(false);
  const [expenseToDelete, setExpenseToDelete] = useState<Expense | null>(null);

  const COLORS = [
    '#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', 
    '#FF5C93', '#82ca9d', '#8dd1e1', '#a4de6c', '#d0ed57'
  ];

  useEffect(() => {
    fetchExpenses();
  }, [token]);

  const fetchExpenses = async () => {
    try {
      const response = await axios.get<Expense[]>(`${import.meta.env.VITE_APP_BACKEND_URL}/expenses`, {
        headers: { Authorization: token },
      });
      const sortedExpenses = response.data.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
      setExpenses(sortedExpenses);
    } catch (error) {
      console.error(error);
    }
  };

  const handleUpdate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!editingExpense) return; 
    try {
      await axios.put(`${import.meta.env.VITE_APP_BACKEND_URL}/expenses/${editingExpense._id}`, editingExpense, {
        headers: { Authorization: token },
      });
      fetchExpenses();
      setEditingExpense(null);
      setIsEditDialogOpen(false);
    } catch (error) {
      console.error(error);
    }
  };

  const handleDelete = async () => {
    if (!expenseToDelete) return;
    try {
      await axios.delete(`${import.meta.env.VITE_APP_BACKEND_URL}/expenses/${expenseToDelete._id}`, {
        headers: { Authorization: token },
      });
      fetchExpenses();
      setExpenseToDelete(null);
      setIsDeleteDialogOpen(false);
    } catch (error) {
      console.error(error);
    }
  };

  const handleEdit = (expense: Expense) => {
    setEditingExpense(expense); 
    setIsEditDialogOpen(true); 
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      await axios.post(`${import.meta.env.VITE_APP_BACKEND_URL}/expenses`, newExpense, {
        headers: { Authorization: token },
      });
      fetchExpenses();
      setNewExpense({
        _id: '', 
        amount: 0,
        category: '',
        description: '',
        date: new Date().toISOString().split('T')[0]
      });
      setIsAddDialogOpen(false);
    } catch (error) {
      console.error(error);
    }
  };

  const getTotalExpenses = () => {
    return expenses.reduce((sum, expense) => sum + expense.amount, 0);
  };

  const getAverageExpense = () => {
    return expenses.length ? getTotalExpenses() / expenses.length : 0;
  };

  const getExpenseTrend = () => {
    if (expenses.length < 2) return 0;
    const sortedExpenses = [...expenses].sort((a, b) => 
      new Date(a.date).getTime() - new Date(b.date).getTime()
    );
    const firstHalf = sortedExpenses.slice(0, Math.floor(sortedExpenses.length / 2));
    const secondHalf = sortedExpenses.slice(Math.floor(sortedExpenses.length / 2));
    const firstHalfAvg = firstHalf.reduce((sum, exp) => sum + exp.amount, 0) / firstHalf.length;
    const secondHalfAvg = secondHalf.reduce((sum, exp) => sum + exp.amount, 0) / secondHalf.length;
    return ((secondHalfAvg - firstHalfAvg) / firstHalfAvg) * 100;
  };

  const getDailyExpenseData = () => {
    const dailyTotals: Record<string, number> = {};
    expenses.forEach(expense => {
      const date = new Date(expense.date).toISOString().split('T')[0];
      dailyTotals[date] = (dailyTotals[date] || 0) + expense.amount;
    });
    return Object.entries(dailyTotals)
      .map(([date, amount]) => ({ date, amount }))
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
      .slice(-30); // Last 30 days
  };

  const getCategoryBreakdown = () => {
    const breakdown = expenses.reduce((acc: Record<string, number>, expense) => {
      acc[expense.category] = (acc[expense.category] || 0) + expense.amount;
      return acc;
    }, {});
    
    const totalExpenses = expenses.reduce((sum, expense) => sum + expense.amount, 0);
    
    return Object.entries(breakdown)
      .map(([category, amount]) => ({
        category,
        amount,
        percentage: (amount / totalExpenses) * 100
      }))
      .sort((a, b) => b.amount - a.amount);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Expenses</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">Rs. {getTotalExpenses().toFixed(2)}</div>
              <p className="text-xs text-muted-foreground">
                {getExpenseTrend() >= 0 ? (
                  <span className="text-green-600 flex items-center">
                    <ArrowUpRight className="h-4 w-4" />
                    {getExpenseTrend().toFixed(1)}% from last period
                  </span>
                ) : (
                  <span className="text-red-600 flex items-center">
                    <ArrowDownRight className="h-4 w-4" />
                    {Math.abs(getExpenseTrend()).toFixed(1)}% from last period
                  </span>
                )}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Average Expense</CardTitle>
              <Target className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">Rs. {getAverageExpense().toFixed(2)}</div>
              <p className="text-xs text-muted-foreground">Per transaction</p>
            </CardContent>
          </Card>

          <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Largest Category</CardTitle>
                <PieChartIcon className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                <div className="text-2xl font-bold">
                    {getCategoryBreakdown()[0]?.category || 'N/A'}
                </div>
                <p className="text-xs text-muted-foreground">
                    {getCategoryBreakdown()[0]?.percentage.toFixed(1)}% of total
                </p>
                </CardContent>
            </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Recent Activity</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {expenses[0]?.category || 'No expenses'}
              </div>
              <p className="text-xs text-muted-foreground">
                Rs. {expenses[0]?.amount.toFixed(2) || '0.00'} - Latest expense
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <Card>
            <CardHeader>
              <CardTitle>Expense Trends</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <ComposedChart data={getDailyExpenseData()}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Area 
                      type="monotone" 
                      dataKey="amount" 
                      fill="#8884d8" 
                      stroke="#8884d8"
                      fillOpacity={0.3}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="amount" 
                      stroke="#ff7300" 
                      dot={false}
                    />
                  </ComposedChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Category Distribution</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={getCategoryBreakdown()}
                      dataKey="amount"
                      nameKey="category"
                      cx="50%"
                      cy="50%"
                      outerRadius={100}
                      labelLine={false}
                      label={({ name, percent }) => 
                        `${name} ${(percent * 100).toFixed(0)}%`
                      }
                    >
                      {getCategoryBreakdown().map((_entry, index) => (
                        <Cell 
                          key={`cell-${index}`} 
                          fill={COLORS[index % COLORS.length]} 
                        />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Recent Expenses</CardTitle>
            <Button onClick={() => setIsAddDialogOpen(true)} className="flex items-center space-x-2">
              <Plus className="h-4 w-4" />
              <span>Add Expense</span>
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {expenses.map((expense) => (
                <div
                  key={expense._id}
                  className="flex items-center justify-between p-4 rounded-lg bg-white border border-gray-100 hover:border-gray-200 transition-all"
                >
                  <div className="flex items-center space-x-4">
                    <div className={`p-2 rounded-full bg-gray-100`}>
                      <Wallet className="h-4 w-4 text-gray-600" />
                    </div>
                    <div>
                      <p className="font-medium">{expense.category}</p>
                      <p className="text-sm text-gray-500">{expense.description}</p>
                      <p className="text-xs text-gray-400">
                        {new Date(expense.date).toLocaleDateString('en-GB')}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <p className="text-lg font-semibold">
                      Rs. {expense.amount.toFixed(2)}
                    </p>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => handleEdit(expense)}>
                          <Edit className="h-4 w-4 mr-2" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          className="text-red-600"
                          onClick={() => {
                            setExpenseToDelete(expense);
                            setIsDeleteDialogOpen(true);
                          }}
                        >
                          <Trash2 className="h-4 w-4 mr-2" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* All Modals below (add,delete,edit) */}
      <Modal open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen} title="Add New Expense" onSubmit={handleSubmit} submitButtonText="Add Expense">
        <div>
          <label className="block text-sm font-medium text-gray-700">Amount (Rs.)</label>
          <input
            type="number"
            min="1"
            step="1"
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
            value={newExpense.amount}
            onChange={(e) => {
              const value = Math.max(0, parseInt(e.target.value) || 0);
              setNewExpense({ ...newExpense, amount: value });
            }}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Category</label>
          <select
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
            value={newExpense.category}
            onChange={(e) => setNewExpense({ ...newExpense, category: e.target.value })}
          >
            <option value="">Select a category</option>
            {categories.map((category) => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Description</label>
          <input
            type="text"
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
            value={newExpense.description}
            onChange={(e) => setNewExpense({ ...newExpense, description: e.target.value })}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Date</label>
          <input
            type="date"
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
            value={newExpense.date}
            onChange={(e) => setNewExpense({ ...newExpense, date: e.target.value })}
          />
        </div>
      </Modal>

      
      <Modal open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen} title="Edit Expense" onSubmit={handleUpdate} submitButtonText="Update Expense">
        <div>
          <label className="block text-sm font-medium text-gray-700">Amount (Rs.)</label>
          <input
            type="number"
            min="1"
            step="1"
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
            value={editingExpense?.amount || ''}
            onChange={(e) => {
              const value = Math.max(0, parseFloat(e.target.value) || 0);
              if (editingExpense) {
                setEditingExpense({ ...editingExpense, amount: value });
              }
            }}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Category</label>
          <select
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
            value={editingExpense?.category || ''}
            onChange={(e) => {
              if (editingExpense) {
                setEditingExpense({ ...editingExpense, category: e.target.value });
              }
            }}
          >
            <option value="">Select a category </option>
            {categories.map((category) => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Description</label>
          <input
            type="text"
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
            value={editingExpense?.description || ''}
            onChange={(e) => {
              if (editingExpense) {
                setEditingExpense({ ...editingExpense, description: e.target.value });
              }
            }}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Date</label>
          <input
            type="date"
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
            value={editingExpense?.date || ''}
            onChange={(e) => {
              if (editingExpense) {
                setEditingExpense({ ...editingExpense, date: e.target.value });
              }
            }}
          />
        </div>
      </Modal>

      <Modal open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen} title="Delete Expense" onSubmit={handleDelete} submitButtonText="Delete">
        <div className="text-gray-700">
          <p>Are you sure you want to delete this expense? This action cannot be undone.</p>
        </div>
      </Modal>
    </div>
  );
};
