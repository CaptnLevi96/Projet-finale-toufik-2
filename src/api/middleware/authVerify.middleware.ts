import { createMiddleware } from "hono/factory"
import { Status } from "../utils/statusCode.ts"
import { getAccessTokenCookie, getRefreshTokenCookie, setIdentityCookie, supabase } from "../../../lib/authAgent.ts"
import type { User } from '@supabase/supabase-js';


export type AuthUserVariable = User
export const authVerify = createMiddleware(async (c, next) => {
    // -- Get auth infos
    const refreshToken = getRefreshTokenCookie(c)
    const accessToken = getAccessTokenCookie(c)

    const { data, error } = await supabase.auth.getUser(accessToken)
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
        const { data: refreshed, error: refreshError } = await supabase.auth.refreshSession({ refresh_token: refreshToken })
        // -- If refresh error, report
        if (refreshError) {
            return c.json({
                success: false,
                error: refreshError,
            }, Status.UNAUTHORIZED)
        }
        // -- If refreshed, set new token
        if( refreshed.session && refreshed.user) {
            c.set('user', refreshed.user)
            setIdentityCookie({c, session: refreshed.session})
        }
    }
    await next()
})