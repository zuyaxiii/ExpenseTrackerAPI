import expenseService from "../services/expenseService.js";

const expenseController = {
    getExpense: async (req, res) => {
        try {
            const page = parseInt(req.query.page) || 1;
            const limit = parseInt(req.query.limit) || 10;

            const result = await expenseService.getUserExpenses(req.user._id, page, limit);
            res.json(result);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },

    addExpense: async (req, res) => {
        try {
            const expense = await expenseService.createExpense(req.body, req.user._id);
            res.status(201).json(expense)
        } catch (error) {
            res.status(400).json({ message: error.message })
        }
    },

    editExpense: async (req, res) => {
        try {
            const expense = await expenseService.updateExpense(req.params.id, req.user._id, req.body);
            res.json(expense)
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    },

    removeExpense: async (req, res) => {
        try {
            const response = await expenseService.deleteExpense(req.params.id, req.user._id);
            res.json(response)
        } catch (error) {
            res.status(500).json({ message: error.message })
        }
    }
}

export default expenseController