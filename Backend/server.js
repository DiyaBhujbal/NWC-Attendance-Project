
import mongoSanitize from "express-mongo-sanitize"
import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import router from "./routes/index.js";
import connectDB from "./config/db.js"
import errorMiddleware from "./middleware/errorMiddleware.js";

 
const app = express();

dotenv.config();

connectDB();

// Middleware
app.use(cors({
  origin: 'http://localhost:5173', // Adjust as needed
}));
app.use(express.json());
app.use(mongoSanitize())

app.use(express.urlencoded({ extended: true })); // For parsing application/x-www-form-urlencoded

// Routes
app.use(router);

//error middleware
app.use(errorMiddleware);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});