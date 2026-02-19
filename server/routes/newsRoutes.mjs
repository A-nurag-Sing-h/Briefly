import express from "express";
import { getMyNews } from "../controllers/newsController.mjs";
import { protect } from "../middlewares/authMiddleware.mjs";

const router = express.Router();

// This route is protected! Only logged-in users get their personalized news.
router.get("/my-news", protect, getMyNews);

export default router;