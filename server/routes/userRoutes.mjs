import express from "express";
import { registerUser,loginUser,updateInterests,trackEngagement } from "../controllers/userController.mjs";
import { protect } from "../middlewares/authMiddleware.mjs";

const router = express.Router();

router.post("/register",registerUser);
router.post("/login",loginUser);
router.get("/profile",protect,(req,res)=>{
    res.json(req.user);
});
router.put("/interests",protect,updateInterests);
router.patch("/track",protect,trackEngagement);

export default router;