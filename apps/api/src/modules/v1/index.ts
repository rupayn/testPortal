import { OpenAPIHono } from "@hono/zod-openapi";
import { healthRoute } from "@/modules/v1/health/health.route";
import { healthController } from "@/modules/v1/health/health.controller";
import { signinRoute } from "@/modules/v1/auth/signin/signin.route";
import { signinController } from "@/modules/v1/auth/signin/signin.controller";

const v1_router = new OpenAPIHono();

v1_router.openapi(healthRoute, healthController);
v1_router.openapi(signinRoute, signinController);

export default v1_router;
