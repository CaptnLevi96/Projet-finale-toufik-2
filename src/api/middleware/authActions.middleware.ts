import { createMiddleware } from "hono/factory"
import env from "../../../env.ts"
import { AuthAgent, createAuthAgent } from "../../../lib/authAgent.ts"
import type { V1Bindings } from "../routes/v1/types.ts"


const authAgent = createAuthAgent(env.SUPABASE_URL, env.SUPABASE_SERVICE_ROLE, 'auth-actions')
export const authActions = createMiddleware<V1Bindings>(async (c, next) => {
    // -- Serve authAgent
    console.log('in authActions')
    c.set('authAgent', authAgent)
    await next()
})