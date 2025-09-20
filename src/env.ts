import {z} from 'zod';
import { config } from 'dotenv';
import { expand } from 'dotenv-expand';

expand(config());

export const EnvSchema = z.object({
    NODE_ENV: z.string().default('development'),
    PORT: z.coerce.number().default(3000),
    LOG_LEVEL: z.enum(['debug','info', 'warn', 'error' ,'fatal']).default('info'),
    DATABASE_URL: z.url(),
    BETTER_AUTH_SECRET: z.string(),
    BETTER_AUTH_URL: z.url(),
    EMAIL_USER: z.email(),
    EMAIL_PASS: z.string(),
})

export type Env = z.infer<typeof EnvSchema>;

let env: Env;

try {
    env = EnvSchema.parse(process.env);
    
} catch (e) {
    const error = e as z.ZodError;
    console.error("❌ Invalid environment variables:", error.format());
    console.error(error);
    process.exit(1);
}

export default env;