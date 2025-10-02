import { z, type OpenAPIHono, type RouteConfig, type RouteHandler } from "@hono/zod-openapi";
import type { PinoLogger } from "hono-pino";

export interface AppBindings{
    Variables:{
        logger: PinoLogger;
    }
}

export interface TokenData {
  accessToken: string;
  refreshToken?: string | null;
  expiresAt: Date;
}

export const SyncTradesSchema = z.object({
  userId: z.string().min(1, "User ID is required"),
  broker: z.enum(["zerodha", "metatrader"]),
});


export type SyncTradesInput = z.infer<typeof SyncTradesSchema>;
export type AppOpenAPI = OpenAPIHono<AppBindings>;
export type AppRouteHandler<R extends RouteConfig> = RouteHandler<R, AppBindings>;