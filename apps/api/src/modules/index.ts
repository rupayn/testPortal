import { OpenAPIHono } from "@hono/zod-openapi";
import { healthRoute } from "./health/health.route";
import { healthController } from "./health/health.controller";
import { signinRoute } from "./auth/signin/signin.route";
import { signinController } from "./auth/signin/signin.controller";

const router = new OpenAPIHono();

router.openapi(healthRoute, healthController);
router.openapi(signinRoute, signinController);

export default router;
