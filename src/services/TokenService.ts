import { isTokenExpired } from '../utils/helpers.js';

interface TokenData {
  accessToken: string;
  refreshToken?: string;
  expiresAt: number;
}

interface StoredToken {
  userId: string;
  broker: string;
  token: TokenData;
}

export class TokenService {
  private tokens: Map<string, StoredToken> = new Map();

  private getKey(userId: string, broker: string): string {
    return `${userId}:${broker}`;
  }

  getToken(userId: string, broker: string): TokenData | null {
    const key = this.getKey(userId, broker);
    const brokerToken = this.tokens.get(key);
    
    if (!brokerToken) {
      return null;
    }

    return brokerToken.token;
  }

  setToken(userId: string, broker: string, token: TokenData): void {
    const key = this.getKey(userId, broker);
    this.tokens.set(key, {
      userId,
      broker,
      token
    });
  }

  isTokenValid(userId: string, broker: string): boolean {
    const token = this.getToken(userId, broker);
    if (!token) {
      return false;
    }

    return !isTokenExpired(token.expiresAt);
  }

  removeToken(userId: string, broker: string): void {
    const key = this.getKey(userId, broker);
    this.tokens.delete(key);
  }

  getUserTokens(userId: string): StoredToken[] {
    const result: StoredToken[] = [];
    for (const [, stored] of this.tokens.entries()) {
      if (stored.userId === userId) result.push(stored);
    }
    return result;
  }
}

export const tokenService = new TokenService();
