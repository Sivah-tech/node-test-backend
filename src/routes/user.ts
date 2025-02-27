import { Router } from "express";
import { login, signup, forgotPassword, getDashboardStats, getUserInfo, editUserInfo } from "../controllers/user/user";
import { checkAuth } from "src/middleware/check-auth";


const router = Router();


router.post("/signup", signup)
router.post("/login", login)
router.patch("/forgot-password", forgotPassword)
router.get("/dashboard", checkAuth, getDashboardStats)
router.route("/:id").get(checkAuth, getUserInfo).put(checkAuth, editUserInfo)



export { router }