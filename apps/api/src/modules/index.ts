import { OpenAPIHono } from "@hono/zod-openapi";
import v1_router from "@/modules/v1";

const router = new OpenAPIHono();

router.route("/v1", v1_router);

export default router;
