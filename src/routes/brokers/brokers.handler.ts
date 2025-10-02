import type {  AppRouteHandler, SyncTradesInput } from "@/lib/types.js";
import type { GetBrokerRoute, GetTokenStatusRoute, SetTokenInput, SetTokenRoute, SyncTradeRoute } from "./brokers.routes.js";
import { syncService } from "@/services/SyncService.js";
import { tokenService } from "@/services/TokenService.js";
import { getAdapter } from "@/adapters/index.js";


export const tradeSync: AppRouteHandler<SyncTradeRoute> = async (c) => {

    try {
      const parsed: SyncTradesInput = await c.req.valid("json");
      const { userId, broker } = parsed;
      
      const trades = await syncService.syncTrades(userId, broker);
      
      return c.json({
        success: true,
        data: {
          userId,
          broker,
          trades,
          count: trades.length
        }
      });
    } catch (error) {
      console.error('Sync trades error:', error);
      
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      
      return c.json({
        success: false,
        error: errorMessage
      }, 400);
    }
}

export const setToken: AppRouteHandler<SetTokenRoute> = async (c) => {

    try {
      const parsed: SetTokenInput = await c.req.valid("json");
      const { userId, broker, accessToken, refreshToken, expiresIn } = parsed;
      
      const expiresAt = Date.now() + (expiresIn ? expiresIn * 1000 : 3600 * 1000); // Default 1 hour
      
      syncService.setUserToken(userId, broker, {
        accessToken,
        refreshToken,
        expiresAt
      });
      
      return c.json({
        success: true,
        message: 'Token set successfully'
      });
    } catch (error) {
      console.error('Set token error:', error);
      
      return c.json({
        success: false,
        error: 'Failed to set token'
      }, 400);
    }
}

export const getTokenStatus: AppRouteHandler<GetTokenStatusRoute> = async (c) => {
    try {
      const { userId, broker } = c.req.valid("query");
      
      const hasValidToken = syncService.hasValidToken(userId, broker);
      const token = tokenService.getToken(userId, broker);
      
      return c.json({
        success: true,
        data: {
          userId,
          broker,
          hasValidToken,
          tokenExists: !!token,
          expiresAt: token?.expiresAt
        }
      });
    } catch (error) {
      console.error('Token status error:', error);
      
      return c.json({
        success: false,
        error: 'Failed to check token status'
      }, 400);
    }
}


export const getBrokerStatus: AppRouteHandler<GetBrokerRoute> = async (c) => {
    try {

        const brokers = Object.entries(getAdapter).map(([name]) => ({
            name,
            displayName: name.charAt(0).toUpperCase() + name.slice(1),
            description: `Integration available for ${name} broker`,
        }));

        return c.json({
            success: true,
            data: {brokers}
        });
        
    } catch (error) {
      console.error('Token status error:', error);
      
      return c.json({
        success: false,
        error: 'Failed to check token status'
      }, 400);
    }
}
