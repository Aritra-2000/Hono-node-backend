import { createRouter } from "@/lib/create-app.js";
import * as handlers from "./brokers.handler.js"
import * as routes from "./brokers.routes.js"

const router = createRouter()
    .openapi(routes.tradeSync, handlers.tradeSync)
    .openapi(routes.setToken, handlers.setToken)
    .openapi(routes.getTokenStatus, handlers.getTokenStatus);

export default router;