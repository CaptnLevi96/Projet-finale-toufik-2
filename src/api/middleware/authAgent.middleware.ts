import { createMiddleware } from "hono/factory"
import env from "../../../env.ts"
import { AuthAgent } from "../../../lib/authAgent.ts"
import { Status } from "../utils/statusCode.ts"

const authAgent = new AuthAgent(env.SUPABASE_URL, env.SUPABASE_SERVICE_ROLE)

export const authMiddleware = createMiddleware(async (c, next) => {
    // -- Get auth infos
    const refreshToken = authAgent.getRefreshTokenCookie(c)
    const accessToken = authAgent.getAccessTokenCookie(c)
    const { data, error } = await authAgent.getUser({ accessToken })
    // -- Set user
    if(data.user){
        c.set('user', data.user)
    }else {
        c.set('user', null)
    }
    // -- Handle error
    if (error) {
        console.error( "Error getUser:ByAccessToken: ", error)
        // -- If no refresh token, report
        if (!refreshToken) {
            console.error("No refresh token")
            return c.json({
                success: false,
                error: error,
            }, Status.UNAUTHORIZED)
        }
        // -- If refresh token, refresh it
        const { data: refreshed, error: refreshError } = await authAgent.refreshSession({ refresh_token: refreshToken })
        // -- If refresh error, report
        if (refreshError) {
            console.error("Error refreshSession: ", refreshError)
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