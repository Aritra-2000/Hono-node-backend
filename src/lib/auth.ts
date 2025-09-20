import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "@/db/index.js"; 
import { openAPI } from "better-auth/plugins"
import * as schema from "@/db/schema.js";
import { sendEmail } from "./email.js";

export const auth = betterAuth({
    database: drizzleAdapter(db, {
        provider: "pg",
        schema,
    }),
    emailAndPassword:{
        enabled: true,
    },
    emailVerification: {
        sendVerificationEmail: async ( { user, url, token }, request) => {
            await sendEmail(
                user.email,
                "Verify your email address",
                `Click the link to verify your email: ${url}`,
            );
        },
    },
    plugins:[
        openAPI(),
    ]
});