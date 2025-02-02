import Expense from "../models/Expense.js"
import { validateExpense } from "../utils/validation.js"

const expenseService = {

    getUserExpenses: async (userId, page = 1, limit = 10) => {
        const skip = (page - 1) * limit;

        const expenses = await Expense.find({ user: userId })
            .sort({ date: -1 })
            .skip(skip)
            .limit(limit);

        const totalExpenses = await Expense.countDocuments({ user: userId });
        const totalPages = Math.ceil(totalExpenses / limit);

        if (expenses.length === 0) {
            throw new Error('No expenses found');
        }

        return {
            expenses,
            totalPages,
            currentPage: page,
        };

    },

    createExpense: async (expenseData, userId) => {
        validateExpense(expenseData)

        delete expenseData.user;
        
        const newExpense = new Expense({ ...expenseData, user: userId });
        await newExpense.save();
        return newExpense
    },

    updateExpense: async (expenseId, userId, updateData) => {
        if (Object.keys(updateData).length === 0) {
            throw new Error("No data provided for update");
        }

        const expense = await Expense.findById(expenseId);

        if (!expense) throw new Error("Expen not found!");

        if (expense.user.toString() !== userId.toString()) {
            throw new Error("Unauthorized: You can only modify your own expenses");
        }

        Object.assign(expense, updateData)

        await expense.save()
        return expense
    },

    deleteExpense: async (expenseId, userId) => {
        const expense = await Expense.findById({ _id: expenseId, user: userId });
        if (!expense) throw new Error("Expense not found!")

        if (expense.user.toString() !== userId.toString()) {
            throw new Error("Unauthorized: You can only delete your own expenses");
        }

        await Expense.deleteOne({ _id: expenseId });

        return { message: "Expense deleted successfully!" }

    }
}

export default expenseService