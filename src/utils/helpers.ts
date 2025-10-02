import { trade } from "@/db/schema.js";

type TradeInsert = typeof trade.$inferInsert; 

export function normalizeZerodhaTrade(rawTrade: any): TradeInsert {
  return {
    id: crypto.randomUUID(),
    userId: rawTrade.userId,
    broker: "zerodha",
    symbol: rawTrade.tradingsymbol || rawTrade.instrument_token?.toString() || "UNKNOWN",
    quantity: Math.abs(parseInt(rawTrade.quantity) || 0),
    price: (parseFloat(rawTrade.average_price) || 0).toFixed(2),
    timestamp: new Date(rawTrade.order_timestamp || new Date()),
    side: rawTrade.transaction_type === "BUY" ? "BUY" : "SELL",
    createdAt: new Date(),
  };
}

// MetaTrader trade normalizer
export function normalizeMetaTraderTrade(rawTrade: any): TradeInsert {
  return {
    symbol: rawTrade.symbol || "UNKNOWN",
    quantity: Math.abs(parseFloat(rawTrade.volume) || 0),
    price: (parseFloat(rawTrade.price) || 0).toFixed(2),
    timestamp: new Date(rawTrade.order_timestamp || new Date()),
    side: rawTrade.type?.toLowerCase() === "buy" ? "BUY" : "SELL",
    userId: "",
    broker: "metatrader",
    id: crypto.randomUUID(),
    createdAt: new Date(),
  };
}

// Generic trade normalizer based on broker
export function normalizeTrades(rawTrades: any[], broker: string): TradeInsert[] {
  switch (broker.toLowerCase()) {
    case "zerodha":
      return rawTrades.map(normalizeZerodhaTrade);
    case "metatrader":
      return rawTrades.map(normalizeMetaTraderTrade);
    default:
      throw new Error(`No normalizer found for broker: ${broker}`);
  }
}


export function isTokenExpired(expiresAt: number, skewMs: number = 30000): boolean {
  return Date.now() >= expiresAt - skewMs;
}

export async function httpRequest(url: string, options: RequestInit, maxRetries = 3): Promise<Response> {
  let lastError: Error | undefined;

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await fetch(url, options);
    } catch (error) {
      lastError = error as Error;
      if (attempt === maxRetries) throw lastError;
      const delay = Math.pow(2, attempt) * 1000; // exponential backoff
      await new Promise((resolve) => setTimeout(resolve, delay));
    }
  }

  throw lastError!;
}
