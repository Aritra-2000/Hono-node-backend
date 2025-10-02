import createApp from "@/lib/create-app.js";
import configureOpenAPI from "./lib/configure-open-api.js";
import { swaggerUI } from '@hono/swagger-ui';
import auths from "@/routes/auths/auths.index.js"
import brokers from "@/routes/brokers/brokers.index.js"
import { auth } from "./lib/auth.js";

const app = createApp();

const routes = [
    auths,
    brokers
];

configureOpenAPI(app);

app.on(["POST", "GET"], "/api/auth/*", (c) => auth.handler(c.req.raw))
 
app.get('/docs/*', swaggerUI({ url: '/openapi.json' }));

routes.forEach((route) => {
    app.route("/",route);
});


export default app;