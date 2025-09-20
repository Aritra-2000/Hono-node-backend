import { createRouter } from "@/lib/create-app.js";
import { createRoute, z } from "@hono/zod-openapi";
import * as HttpStatusCodes from "stoker/http-status-codes"


const SignInSchema = z.object({
    email: z.email(),
    password: z.string().min(6).max(20),
    role: z.enum(["user", "admin"]).default("user")
});

const SignInResponseSchema = z.object({
    token: z.string(),
    email: z.email(),
    name: z.string(),
    role: z.string()
});

const router = createRouter()
    .openapi(
    createRoute({
        method: 'post',
        path: '/sign-in',
        tags: ['Auth'],
        summary: 'User Sign in',
        request: {
        body: {
            content: {
            'application/json': {
                schema: SignInSchema,
            },
            },
        },
        },
        responses: {
        [HttpStatusCodes.OK]: {
            description: 'Successful Sign Up',
            content: {
            'application/json': {
                schema: SignInResponseSchema,
            },
            },
        },
        [HttpStatusCodes.INTERNAL_SERVER_ERROR]: {
            description: 'Internal Server Error',
            content: {
            'application/json': {
                schema: z.object({
                message: z.string(),
                error: z.string().optional(),
                }),
            },
            },
        },
        },
    }),
    async (c) => {
        try {
        const body = await c.req.json();
        const parsed = SignInSchema.parse(body);

            return c.json({
                token: 'aswdcvvbndjknasdkj',
                name: "Aritra",
                email: parsed.email,
                role: parsed.role,
            }, 200);

        } catch (error) {
            return c.json({
                message: 'Internal server error',
                error: (error instanceof Error ? error.message : String(error)),
            }, 500);
        }
    }
);



export default router;