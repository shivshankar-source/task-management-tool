import { Router } from "express";
import { login, register } from "../controllers/authController.js";
import { protect } from "../middleware/auth.js";
const router = Router();
router.post("/register", register);
router.post("/login", login);
router.get("/me", protect, (req, res) => res.json({ user: req.user }));
export default router;