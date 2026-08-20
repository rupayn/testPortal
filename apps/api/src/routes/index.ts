import { Router, type Router as RouterType } from "express";
import signInRouter from "./user/auth/signin";
import healthRouter from "./health";

const router: RouterType = Router();
router.use(healthRouter);
router.use("/auth", signInRouter);
export default router;
