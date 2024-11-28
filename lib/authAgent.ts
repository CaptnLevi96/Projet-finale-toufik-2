import { createClient, type Provider, type SupabaseClient, type User } from "@supabase/supabase-js";
import type { SupabaseAuthClient } from "@supabase/supabase-js/dist/module/lib/SupabaseAuthClient.js";
import type { Context } from "hono";
import { setCookie, getCookie } from "hono/cookie";

type AuthRequestProvider = {
    provider: Provider,
    accessToken?: string,
    options?: {
        redirectTo?: string,
        scopes?: string,
        data?: any
    }
}

type AuthRequest = {
    email: string,
    password: string,
    option?: {
        channel: string,
        emailRedirectTo: string,
        data: any
    }
}

type AuthCookie = {
    c: Context,
    token: string,
    expireAt: string,
}

export type AuthUserVariable = User
export class AuthAgent {
    #client: SupabaseClient;
    #accessTokenCookieName: string;
    #refreshTokenCookieName: string;
    #entrypoint: string;
    auth: SupabaseAuthClient;


    constructor(URL: string, SERVICE_ROLE: string, entrypoint: string) {
        this.#accessTokenCookieName = "access_token"
        this.#refreshTokenCookieName = "refresh_token"
        this.#entrypoint = entrypoint
        this.#client = createClient(
            URL,
            SERVICE_ROLE
        )
        this.auth = this.#client.auth
    }

    async signIn(req: AuthRequest) {
        return await this.auth.signInWithPassword(req)
    }

    setAccessTokenCookie(req: AuthCookie) {
        const { c, token, expireAt } = req
        setCookie(c, this.#accessTokenCookieName, token, {
            ...(expireAt && { expires: new Date(expireAt) }),
            httpOnly: true,
            path: "/",
            secure: true,
        })
    }

    setRefreshTokenCookie(req: AuthCookie) {
        const { c, token, expireAt } = req
        setCookie(c, this.#refreshTokenCookieName, token, {
            ...(expireAt && { expires: new Date(expireAt) }),
            httpOnly: true,
            path: "/",
            secure: true,
        })
    }    

    getAccessTokenCookie(c: Context) {
        const token = getCookie(c, this.#accessTokenCookieName) ?? ""
        return token
    }

    getRefreshTokenCookie(c: Context) {
        const token = getCookie(c, this.#refreshTokenCookieName) ?? ""
        return token
    }

    isConnected() {
        return !!this.#client
    }
}

export const createAuthAgent = (URL: string, SERVICE_ROLE: string, entrypoint: string) => {
    const authAgent = new AuthAgent(URL, SERVICE_ROLE, entrypoint)
    console.log(authAgent.isConnected(), entrypoint)
    return authAgent
}