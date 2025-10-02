import { createRoute, z } from "@hono/zod-openapi";
import * as HttpStatusCodes from "stoker/http-status-codes" 
import { jsonContent } from "stoker/openapi/helpers";
import { boolean } from "zod";


const SyncTradesSchema = z.object({
  userId: z.string().min(1, "User ID is required"),
  broker: z
    .enum(["zerodha", "metatrader"])
    .refine((val) => ["zerodha", "metatrader"].includes(val), {
      message: 'Broker must be either "zerodha" or "metatrader"',
    }),
});

const SyncTradesResponseSchema = z.object({
  success: z.boolean(),
  data: z
    .object({
      userId: z.string(),
      broker: z.enum(["zerodha", "metatrader"]),
      trades: z.array(z.unknown()),
      count: z.number(),
    })
    .optional(), 
  error: z.string().optional(), 
});

const SetTokenSchema = z.object({
  userId: z.string().min(1, 'User ID is required'),
  broker: z.enum(['zerodha', 'metatrader']),
  accessToken: z.string().min(1, 'Access token is required'),
  refreshToken: z.string().optional(),
  expiresIn: z.number().optional() 
});

export const GetTokenStatusQuerySchema = z.object({
  userId: z.string().min(1, "User ID is required"),
  broker: z.enum(["zerodha", "metatrader"]),
});

export const GetTokenStatusResponseSchema = z.object({
  success: z.boolean(),
  data: z
    .object({
      userId: z.string(),
      broker: z.enum(["zerodha", "metatrader"]),
      hasValidToken: z.boolean(),
      tokenExists: z.boolean(),
      expiresAt: z.string().nullable().optional(), // or .date() if serialized properly
    })
    .optional(),
  error: z.string().optional(),
});

export const GetBrokersResponseSchema = z.object({
  success: z.boolean(),
  data: z.object({
    brokers: z.array(
      z.object({
        name: z.string(),
        displayName: z.string(),
        description: z.string(),
      })
    ),
  }),
});

export const ErrorResponseSchema = z.object({
  message: z.string(),
  error: z.string().optional()
});

export const tradeSync = createRoute({
    path: "/sync",
    method: "post",
    tags: ["Sync Trades"],
    summary: "Sync Trades from Broker",
    request:{
        body: jsonContent(
            SyncTradesSchema,
            "Sync Trades from Broker"
        )
    },
    responses:{
        [HttpStatusCodes.OK]:  jsonContent(
            SyncTradesResponseSchema,
            "Successful Sync Trades"
        ),
        [HttpStatusCodes.INTERNAL_SERVER_ERROR]: {
            ErrorResponseSchema,
            description: "Internal Server Error"
        }
    }

});

export const setToken = createRoute({
    path: "/token",
    method: "post",
    tags: ["Broker Token"],
    summary: "Set Broker Token for a User",
    request:{
        body: jsonContent(
            SetTokenSchema,
            "set Broker Token for a User"
        )
    },
    responses:{
        [HttpStatusCodes.OK]:  jsonContent(
            z.object({ success: boolean() }),
            "Token Set Successfully"
        ),
        [HttpStatusCodes.INTERNAL_SERVER_ERROR]: {
            ErrorResponseSchema,
            description: "Internal Server Error"
        }
    }

});

export const getTokenStatus = createRoute({
    path: "/token/status",
    method: "get",
    tags: ["token Status"],
    summary: "Get Broker Token Status for a User",
    request:{
        query: GetTokenStatusQuerySchema
    },
    responses:{
        [HttpStatusCodes.OK]:  jsonContent(
            GetTokenStatusResponseSchema,
            "Token Set Successfully"
        ),
        [HttpStatusCodes.INTERNAL_SERVER_ERROR]: {
            ErrorResponseSchema,
            description: "Internal Server Error"
        }
    }

});

export const getBrokerStatus = createRoute({
    path: "/brokers",
    method: "get",
    tags: ["brokers Info"],
    summary: "List available brokers and their details",
    responses:{
        [HttpStatusCodes.OK]:  jsonContent(
            GetBrokersResponseSchema,
            "List of supported brokers"
        ),
        [HttpStatusCodes.INTERNAL_SERVER_ERROR]: {
            ErrorResponseSchema,
            description: "Internal Server Error"
        }
    }

});

export type SetTokenRoute = typeof setToken;
export type SetTokenInput = z.infer<typeof SetTokenSchema>;

export type SyncTradeRoute = typeof tradeSync;
export type SyncTradesInput = z.infer<typeof SyncTradesSchema>;

export type GetTokenStatusRoute = typeof getTokenStatus;
export type GetTokenStatusInput = z.infer<typeof GetTokenStatusQuerySchema>;

export type GetBrokerRoute = typeof getBrokerStatus;