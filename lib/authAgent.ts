import { createClient, type Session } from "@supabase/supabase-js";
import type { Context } from "hono";
import { setCookie, getCookie } from "hono/cookie";
import env from "../env.ts";
import { sign } from "./jwt.ts";


type AuthCookie = { c: Context, session: Session }

export const supabase = createClient(env.SUPABASE_URL, env.SUPABASE_SERVICE_ROLE)

// # Cookies
// -- Access token
const _accessTokenCookieName = "access_token"
export function setAccessTokenCookie(req: AuthCookie) {
    const { c, session } = req
    const { access_token, expires_in } = session
    setCookie(c, _accessTokenCookieName, access_token, {
        ...(expires_in && { expires: new Date(expires_in + new Date().getTime()) }),
        httpOnly: true,
        path: "/",
        secure: true,
    })
}
export function getAccessTokenCookie(c: Context) {
    const token = getCookie(c, _accessTokenCookieName) ?? ""
    return token
}
// -- Refresh token
const _refreshTokenCookieName = "refresh_token"
export function setRefreshTokenCookie(req: AuthCookie) {
    const { c, session } = req
    const { refresh_token, expires_in } = session
    setCookie(c, _refreshTokenCookieName, refresh_token, {
        ...(expires_in && { expires: new Date(expires_in + new Date().getTime()) }),
        httpOnly: true,
        path: "/",
        secure: true,
    })
}
export function getRefreshTokenCookie(c: Context) {
    const token = getCookie(c, _refreshTokenCookieName) ?? ""
    return token
}
//-- Identity token
const _identityCookieName = "identity"
export async function setIdentityCookie(req: AuthCookie) {
    const { c, session } = req
    const { user, expires_in } = session
    const signedIdentity = await sign({
        user,
        exp: new Date(expires_in + new Date().getTime())
    })
    setCookie(c, _identityCookieName, signedIdentity, {
        ...(expires_in && { expires: new Date(expires_in + new Date().getTime()) }),
        httpOnly: true,
        path: "/",
        secure: true,
    })
    return session
}
export function getIdentityCookie(c: Context) {
    const token = getCookie(c, _identityCookieName) ?? ""
    return token
}