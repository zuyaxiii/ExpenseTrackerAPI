import mongoose from "mongoose";
import Expense from "../../src/models/Expense.js";
import expenseService from "../../src/services/expenseService.js";
import { MongoMemoryServer } from "mongodb-memory-server";

describe("Expense Service", () => {
    let mongoServer;
    let userId;
    let otherUserId;

    const createTestExpense = (override = {}) => ({
        title: "Test Expense",
        amount: 100,
        date: "2024-01-31",
        category: "Food",
        notes: "Test notes",
        ...override
    });

    const saveTestExpense = async (data = {}) => {
        const expense = new Expense({
            ...createTestExpense(),
            user: userId,
            ...data
        });
        return await expense.save();
    };

    beforeAll(async () => {
        mongoServer = await MongoMemoryServer.create();
        const mongoUri = mongoServer.getUri();
        await mongoose.connect(mongoUri, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
    });

    afterAll(async () => {
        await mongoose.connection.dropDatabase();
        await mongoose.connection.close();
        await mongoServer.stop();
    });

    beforeEach(async () => {
        await Expense.deleteMany({});
        userId = new mongoose.Types.ObjectId();
        otherUserId = new mongoose.Types.ObjectId();
    });

    describe("createExpense", () => {
        test("should successfully create an expense", async () => {
            const expenseData = createTestExpense({
                title: "Lunch",
                amount: 150
            });

            const expense = await expenseService.createExpense(expenseData, userId);

            expect(expense).toHaveProperty("_id");
            expect(expense.user.toString()).toBe(userId.toString());
            expect(expense.title).toBe(expenseData.title);
            expect(expense.amount).toBe(expenseData.amount);
        });
    });

    describe("updateExpense", () => {
        test("should not allow unauthorized users to update an expense", async () => {
            const expense = await saveTestExpense({
                title: "Groceries",
                amount: 500
            });

            await expect(
                expenseService.updateExpense(expense._id, otherUserId, { amount: 600 })
            ).rejects.toThrow("Unauthorized: You can only modify your own expenses");

            const unchangedExpense = await Expense.findById(expense._id);
            expect(unchangedExpense.amount).toBe(500);
        });

        test("should allow authorized users to update their expense", async () => {
            const expense = await saveTestExpense({
                title: "Groceries",
                amount: 500
            });

            const updatedExpense = await expenseService.updateExpense(
                expense._id, 
                userId, 
                { amount: 600 }
            );

            expect(updatedExpense.amount).toBe(600);
        });
    });

    describe("deleteExpense", () => {
        test("should not allow unauthorized users to delete an expense", async () => {
            const expense = await saveTestExpense({
                title: "Movie",
                amount: 300,
                category: "Entertainment"
            });

            await expect(
                expenseService.deleteExpense(expense._id, otherUserId)
            ).rejects.toThrow("Unauthorized: You can only delete your own expenses");

            const existingExpense = await Expense.findById(expense._id);
            expect(existingExpense).toBeTruthy();
        });

        test("should allow authorized users to delete their expense", async () => {
            const expense = await saveTestExpense({
                title: "Movie",
                amount: 300
            });

            await expenseService.deleteExpense(expense._id, userId);

            const deletedExpense = await Expense.findById(expense._id);
            expect(deletedExpense).toBeNull();
        });
    });
});