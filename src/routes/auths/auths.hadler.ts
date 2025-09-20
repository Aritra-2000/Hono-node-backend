import type { SignUpListRoute } from "./auths.routes.js";
import type { AppRouteHandler } from "@/lib/types.js";


export const Auth: AppRouteHandler<SignUpListRoute> = async (c) => {

    try {
        const body = await c.req.json();

        return c.json({
            token: 'aswdcvvbndjknasdkj',
            name: body.name,
            email: body.email,
            role: body.role,
        }, 200);
        
    } catch (error) {
        return c.json({
            message: 'Internal server error',
            error: (error instanceof Error ? error.message : String(error)),
        }, 500);
    }
}