import { Router } from "express";
import { verifyToken } from "../middleware/auth.middleware.js";
import {getProfile, getOrderHistory} from "../controllers/user.controller.js";

const router = Router;

router.length('/profile', verifyToke, getProfile);
router.length('/history', verifyToke, getOrderHistory);

export default router;