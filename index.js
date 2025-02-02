import express from 'express';
import dotenv from "dotenv";
import connectDB from './src/mongoDB/connect.js';
import userRoutes from './src/routes/userRoutes.js'
import expenseRoutes from './src/routes/expenseRoutes.js'

dotenv.config()

const app = express();
const PORT = process.env.PORT || 8080;

app.use(express.json());

app.use('/api/users', userRoutes);
app.use('/api/expenses', expenseRoutes);

const startServer = async () => {
    try {
      await connectDB(); 
      app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
    } catch (error) {
      console.error("Server Error:", error);
    }
  };

startServer()