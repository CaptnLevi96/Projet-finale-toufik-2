import { createClient, type Provider, type Session, type SupabaseClient, type User } from "@supabase/supabase-js";
import type { SupabaseAuthClient } from "@supabase/supabase-js/dist/module/lib/SupabaseAuthClient.js";
import type { Context } from "hono";
import { setCookie, getCookie } from "hono/cookie";
import env from "../env.ts";


type AuthCookie = { c: Context, session: Session }

export const supabase = createClient(env.SUPABASE_URL, env.SUPABASE_SERVICE_ROLE)

const _accessTokenCookieName = "access_token"
export function setAccessTokenCookie(req: AuthCookie) {
    const { c, session } = req
    const { access_token, expires_at, expires_in } = session
    setCookie(c, _accessTokenCookieName, access_token, {
        ...(expires_in && { expires: new Date(expires_in + new Date().getTime()) }),
        httpOnly: true,
        path: "/",
        secure: true,
    })
    console.log('get cookie', getCookie(c, _accessTokenCookieName))
}
export function getAccessTokenCookie(c: Context) {
    const token = getCookie(c, _accessTokenCookieName) ?? ""
    return token
}

const _refreshTokenCookieName = "refresh_token"
export function setRefreshTokenCookie(req: AuthCookie) {
    const { c, session } = req
    const { refresh_token, expires_at, expires_in } = session
    setCookie(c, _refreshTokenCookieName, refresh_token, {
        ...(expires_in && { expires: new Date(expires_in + new Date().getTime()) }),
        httpOnly: true,
        path: "/",
        secure: true,
    })
    console.log('get cookie', getCookie(c, _refreshTokenCookieName))
}
export function getRefreshTokenCookie(c: Context) {
    const token = getCookie(c, _refreshTokenCookieName) ?? ""
    return token
}