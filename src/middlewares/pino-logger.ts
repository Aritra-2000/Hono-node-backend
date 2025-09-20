import env from '@/env.js';
import pino from 'pino'

const isDev = env.NODE_ENV !== 'production';
const islvl = env.LOG_LEVEL;

export function pinoInstance() {
  return pino({
            level: islvl || 'info',
            transport: isDev ? {
                target: 'pino-pretty', 
                options: {
                colorize: true,      
                }
            } : undefined,
        })
}