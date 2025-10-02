import { getAdapter } from "../adapters/index.js";
import { tokenService } from "./TokenService.js";
import { normalizeTrades } from "../utils/helpers.js";
import { trade } from "@/db/schema.js";

type TradeInsert = typeof trade.$inferInsert;

export class SyncService {
  async syncTrades(userId: string, brokerName: string): Promise<TradeInsert[]> {
    try {
      console.log(`🔄 Starting trade sync for user ${userId} with broker ${brokerName}`);

      // 1️⃣ Get the appropriate adapter
      const adapter = getAdapter(brokerName);

      // 2️⃣ Get or refresh token
      const accessToken = await this.getValidToken(userId, brokerName, adapter);

      // 3️⃣ Fetch raw trades from broker API
      const rawTrades = await adapter.fetchTrades(accessToken);

      // 4️⃣ Normalize trades into our schema format
      const normalizedTrades = normalizeTrades(rawTrades, brokerName).map((t) => ({
        ...t,
        userId, // ensure correct user assignment
      }));

      console.log(`✅ Successfully normalized ${normalizedTrades.length} trades for ${brokerName}`);

      // (Optionally) persist to DB here if needed
      // await db.insert(trade).values(normalizedTrades).onConflictDoNothing();

      return normalizedTrades;
    } catch (error) {
      console.error(`❌ Error syncing trades for ${brokerName}:`, error);
      throw error;
    }
  }

  // 🔐 Validates or refreshes a broker token
  private async getValidToken(userId: string, brokerName: string, adapter: any): Promise<string> {
    // If token valid — use it
    if (tokenService.isTokenValid(userId, brokerName)) {
      const token = tokenService.getToken(userId, brokerName);
      if (token) return token.accessToken;
    }

    // Try refreshing the token if refresh token exists
    const existingToken = tokenService.getToken(userId, brokerName);
    if (existingToken?.refreshToken) {
      try {
        console.log(`♻️ Refreshing token for ${brokerName}`);
        const newToken = await adapter.refreshToken(existingToken.refreshToken);
        tokenService.setToken(userId, brokerName, newToken);
        return newToken.accessToken;
      } catch (error) {
        console.error(`⚠️ Failed to refresh token for ${brokerName}:`, error);
        tokenService.removeToken(userId, brokerName);
      }
    }

    throw new Error(`No valid token for ${brokerName}. Please authenticate first.`);
  }

  // 🔑 Set token after user authenticates
  setUserToken(userId: string, brokerName: string, token: any): void {
    tokenService.setToken(userId, brokerName, token);
  }

  // ✅ Quick check for token validity
  hasValidToken(userId: string, brokerName: string): boolean {
    return tokenService.isTokenValid(userId, brokerName);
  }
}

// Singleton instance
export const syncService = new SyncService();

// Helper export for programmatic use
export async function syncTrades(userId: string, brokerName: string): Promise<TradeInsert[]> {
  return syncService.syncTrades(userId, brokerName);
}
