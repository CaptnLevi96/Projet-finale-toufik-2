import {z} from 'zod'
import { serveConfig } from './lib/settings.ts'

serveConfig()

const EnvSchema = z.object({
    NODE_ENV: z.string().default('development'),
    PORT_API: z.coerce.number().default(3001),
    PORT_WEB: z.coerce.number().default(3000),
    DATABASE_URL: z.string(),
    DATABASE_USER: z.string(),
    DATABASE_PASSWORD: z.string(),

}).superRefine((data, ctx) => {
    if (data.NODE_ENV === 'prod') {
        // ctx.addIssue({}) // TODO: add issue
    }
    return true
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