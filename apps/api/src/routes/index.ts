import { Router, type Router as RouterType } from "express";
import signInRouter from "./user/auth/signin";

const router: RouterType = Router();

router.use("/auth", signInRouter);
export default router;
