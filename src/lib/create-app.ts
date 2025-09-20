import { OpenAPIHono } from '@hono/zod-openapi'
import { notFound, onError, serveEmojiFavicon } from 'stoker/middlewares'
import { pinoLogger } from 'hono-pino';
import { pinoInstance } from '@/middlewares/pino-logger.js';
import type { AppBindings } from './types.js';

export function createRouter(){
    return  new OpenAPIHono<AppBindings>({
        strict: false,
    });
}

export default function createApp(){

    const app = createRouter();
    app.use(serveEmojiFavicon("📋"))
    app.use('*', pinoLogger({ pino: pinoInstance(), http: {reqId: () => crypto.randomUUID()} }));

    app.notFound(notFound);
    app.onError(onError);

    return app;
}
