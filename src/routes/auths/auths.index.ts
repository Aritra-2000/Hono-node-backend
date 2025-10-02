import { createRouter } from "@/lib/create-app.js";
import * as handlers from "./auths.hadler.js"
import * as routes from "./auths.routes.js"

const router = createRouter()
    .openapi(routes.signup, handlers.signup)
    .openapi(routes.signin, handlers.signin);

export default router;