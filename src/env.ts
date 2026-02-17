import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

// Treat empty strings as undefined for optional vars
const optionalString = z
  .string()
  .optional()
  .transform((v) => (v === "" ? undefined : v));

export const env = createEnv({
  server: {
    GROQ_API_KEY: z.string().min(1, "GROQ_API_KEY is required"),
    UPSTASH_REDIS_REST_URL: optionalString,
    UPSTASH_REDIS_REST_TOKEN: optionalString,
    SERPER_API_KEY: optionalString,
  },
  runtimeEnv: {
    GROQ_API_KEY: process.env.GROQ_API_KEY,
    UPSTASH_REDIS_REST_URL: process.env.UPSTASH_REDIS_REST_URL,
    UPSTASH_REDIS_REST_TOKEN: process.env.UPSTASH_REDIS_REST_TOKEN,
    SERPER_API_KEY: process.env.SERPER_API_KEY,
  },
});
