import type { IBrokerAdapter } from './IBrokerAdapter.js';
import env from '../env.js';
import type { TokenData } from '@/lib/types.js';


export class ZerodhaAdapter implements IBrokerAdapter {
  private readonly baseUrl: string;
  private readonly apiKey: string;
  private readonly apiSecret: string;

  constructor() {
    this.baseUrl = env.ZERODHA_BASE_URL || 'https://api.kite.trade';
    this.apiKey = env.ZERODHA_API_KEY || '';
    this.apiSecret = env.ZERODHA_API_SECRET || '';
  }

  getName(): string {
    return 'zerodha';
  }

  async fetchTrades(token: string): Promise<any[]> {
    try {
      const response = await fetch(`${this.baseUrl}/orders`, {
        method: 'GET',
        headers: {
          'Authorization': `token ${this.apiKey}:${token}`,
          'X-Kite-Version': '3',
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error('UNAUTHORIZED');
        }
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      
      // Filter for completed trades only
      const completedTrades = data.data?.filter((order: any) => 
        order.status === 'COMPLETE' && order.product === 'CNC'
      ) || [];

      return completedTrades;
    } catch (error) {
      console.error('Zerodha fetchTrades error:', error);
      throw error;
    }
  }

  async refreshToken(oldToken: string): Promise<TokenData> {
    try {
      // For Zerodha, we need to use the refresh token flow
      // This is a simplified implementation - in production, you'd need to handle the full OAuth flow
      const response = await fetch(`${this.baseUrl}/session/refresh_token`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          'refresh_token': oldToken,
          'api_key': this.apiKey
        })
      });

      if (!response.ok) {
        throw new Error(`Token refresh failed: ${response.statusText}`);
      }

      const data = await response.json();
      
      return {
        accessToken: data.access_token,
        refreshToken: data.refresh_token,
        expiresAt: new Date(Date.now() + (data.expires_in * 1000))
      };
    } catch (error) {
      console.error('Zerodha refreshToken error:', error);
      throw error;
    }
  }
}
