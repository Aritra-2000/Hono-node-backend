import { createRoute, z } from "@hono/zod-openapi";
import * as HttpStatusCodes from "stoker/http-status-codes" 
import { jsonContent } from "stoker/openapi/helpers";

export const SignUpSchema = z.object({
    name: z.string().min(3).max(30),
    email: z.email(),
    password: z.string().min(6).max(20),
    role: z.enum(["user", "admin"]).default("user")
});

export const SignUpResponseSchema = z.object({
    token: z.string(),
    email: z.email(),
    name: z.string(),
    role: z.string()
});

export const ErrorResponseSchema = z.object({
  message: z.string(),
  error: z.string().optional()
});

export const signup = createRoute({
    path: "/sign-up",
    method: "post",
    tags: ["Auth"],
    summary: "User Sign Up",
    request:{
        body: jsonContent(
            SignUpSchema,
            "User Sign Up"
        )
    },
    responses:{
        [HttpStatusCodes.OK]:  jsonContent(
            SignUpResponseSchema,
            "Successful Sign Up"
        ),
        [HttpStatusCodes.INTERNAL_SERVER_ERROR]: {
            ErrorResponseSchema,
            description: "Internal Server Error"
        }
    }

});

export type SignUpListRoute = typeof signup;