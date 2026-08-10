import { Router, type Router as RouterType } from "express";
import { validate } from "../../../middleware/validate";
import { signInSchema } from "@repo/schemas";
import { siginController } from "../../../controller/auth/signin";
import { asyncHandler } from "../../../utils/asyncHandler";

const router: RouterType = Router();
router.post("/signin", validate(signInSchema), asyncHandler(siginController));

export default router;
