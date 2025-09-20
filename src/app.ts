import createApp from "@/lib/create-app.js";
import configureOpenAPI from "./lib/configure-open-api.js";
import index from "@/routes/index.route.js"
import { swaggerUI } from '@hono/swagger-ui';
import auths from "@/routes/auths/auths.index.js"

const app = createApp();

const routes = [
    index,
    auths
];

configureOpenAPI(app);

app.get('/docs/*', swaggerUI({ url: '/openapi.json' }));

routes.forEach((route) => {
    app.route("/",route);
});


export default app;