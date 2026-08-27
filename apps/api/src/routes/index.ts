import { OpenAPIHono } from "@hono/zod-openapi";
import { healthRoute } from "./health";
import { healthController } from "../controller/health";
import { signinRoute } from "./user/auth/signin";
import { signinController } from "../controller/auth/signin";

const router = new OpenAPIHono();

router.openapi(healthRoute, healthController);
router.openapi(signinRoute, signinController);

export default router;
