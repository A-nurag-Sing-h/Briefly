import express from "express";
import { protect } from "../middlewares/authMiddleware.mjs";
import { addBookmark,showBookmarks,deleteBookmark} from "../controllers/bookmarkController.mjs";

const router = express.Router();

router.post("/bookmarks", protect, addBookmark);
router.get("/bookmarks",protect,showBookmarks);
router.delete("/bookmarks/:id",deleteBookmark);

export default router; 