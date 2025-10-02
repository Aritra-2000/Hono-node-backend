import type { IBrokerAdapter } from './IBrokerAdapter.js';
import { ZerodhaAdapter } from './ZerodhaAdapter.js';

const adapterRegistry: Record<string, IBrokerAdapter> = {
  zerodha: new ZerodhaAdapter(),
};

export function getAdapter(brokerName: string): IBrokerAdapter {
  const adapter = adapterRegistry[brokerName.toLowerCase()];
  if (!adapter) {
    throw new Error(`Unsupported broker: ${brokerName}`);
  }
  return adapter;
}

export { ZerodhaAdapter };
