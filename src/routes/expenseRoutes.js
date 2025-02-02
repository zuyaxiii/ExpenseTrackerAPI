import expenseController from "../controllers/expenseController.js";
import express from "express"
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/" , authMiddleware , expenseController.getExpense)
router.post("/", authMiddleware, expenseController.addExpense);
router.put("/:id", authMiddleware, expenseController.editExpense);
router.delete("/:id", authMiddleware, expenseController.removeExpense);

export default router;