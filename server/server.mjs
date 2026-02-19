// Imports 
import express from "express";
import dotenv from "dotenv";
import morgan from "morgan";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import connectDB from "./config/db.mjs";
import userRoutes from "./routes/userRoutes.mjs";
import newsRoutes from "./routes/newsRoutes.mjs";
import bookmarkRoutes from "./routes/bookmarkRoutes.mjs";

// __filename and __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables
dotenv.config({path: path.join(__dirname,".env")});

// database connection 
connectDB();

// Initialize the express 
const app = express();

// Middlewares
app.use(express.json());
app.use(cors());
app.use(morgan("dev"));
app.use("/api/users",userRoutes);
app.use("/api/news",newsRoutes);
app.use("/api/bookmark",bookmarkRoutes);

// basic route 
app.get("/",(req,res)=>{
    res.status(200).json({message:"Briefly API is running successfully!"});
});

// Starting the server
const PORT = process.env.PORT || 3000;
app.listen(PORT,()=>{
    console.log(`Server is running on PORT: ${PORT}`);
});