import { OpenAPIHono } from "@hono/zod-openapi";
import { healthRoute } from "./health/health.route";
import { healthController } from "./health/health.controller";
import { signinRoute } from "./auth/signin/signin.route";
import { signinController } from "./auth/signin/signin.controller";

const v1_router = new OpenAPIHono();

v1_router.openapi(healthRoute, healthController);
v1_router.openapi(signinRoute, signinController);

export default v1_router;
