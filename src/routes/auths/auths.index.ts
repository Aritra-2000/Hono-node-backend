import { createRouter } from "@/lib/create-app.js";
import * as handlers from "./auths.hadler.js"
import * as routes from "./auths.routes.js"

const router = createRouter()
    .openapi(routes.signup, handlers.Auth);

export default router;