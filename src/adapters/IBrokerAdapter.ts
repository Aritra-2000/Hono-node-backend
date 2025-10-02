import type { TokenData } from '@/lib/types.js';

export interface IBrokerAdapter<RawTrade = unknown> {
  getName(): string;
  fetchTrades(token: string): Promise<RawTrade[]>;
  refreshToken(oldToken: string): Promise<TokenData>;
}
