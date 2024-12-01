import {z} from 'zod'
import { serveConfig } from './lib/settings.ts'

serveConfig()

const EnvSchema = z.object({
    NODE_ENV: z.string().default('development'),
    PORT: z.coerce.number().default(3000),
    DATABASE_URL: z.string().min(1),
    DATABASE_USER: z.string().min(1),
    DATABASE_NAME: z.string().min(1),
    DATABASE_PASSWORD: z.string().min(1),
    SUPABASE_URL: z.string().min(1),
    SUPABASE_SERVICE_ROLE: z.string().min(1),
})

export type Env = z.infer<typeof EnvSchema>


let env: Env;
try {
    env = EnvSchema.parse(process.env)
} catch (e) {
    const error = e as z.ZodError
    console.error(`❌ Invalid environment variables:`)
    console.error(error.flatten().fieldErrors)
    process.exit(1)
}

export default env