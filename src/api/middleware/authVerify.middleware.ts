import { createMiddleware } from "hono/factory"
import env from "../../../env.ts"
import { Status } from "../utils/statusCode.ts"
import { createAuthAgent } from "../../../lib/authAgent.ts"

const authAgent = createAuthAgent(env.SUPABASE_URL, env.SUPABASE_SERVICE_ROLE, 'auth-verify')
export const authVerify = createMiddleware(async (c, next) => {
    // -- Get auth infos
    const refreshToken = authAgent.getRefreshTokenCookie(c)
    const accessToken = authAgent.getAccessTokenCookie(c)
    const { data, error } = await authAgent.auth.getUser(accessToken )
    // -- Set user
    if(data?.user){
        c.set('user', data.user)
    }else {
        c.set('user', null)
    }
    // -- Handle error
    if (error) {
        // -- If no refresh token, report
        if (!refreshToken) {
            return c.json({
                success: false,
                error: "No refresh token",
            }, Status.UNAUTHORIZED)
        }
        // -- If refresh token, refresh it
        const { data: refreshed, error: refreshError } = await authAgent.auth.refreshSession({ refresh_token: refreshToken })
        // -- If refresh error, report
        if (refreshError) {
            return c.json({
                success: false,
                error: refreshError,
            }, Status.UNAUTHORIZED)
        }
        // -- If refreshed, set new token
        if( refreshed.user) {
            c.set('user', refreshed.user)
        }
    }
    await next()
})