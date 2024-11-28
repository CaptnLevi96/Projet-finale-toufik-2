import { createClient, type Provider, type SupabaseClient, type User } from "@supabase/supabase-js";
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
export class AuthAgent<T = any> {
    #authClient: SupabaseClient;
    #accessTokenCookieName: string;
    #refreshTokenCookieName: string;

    constructor(URL: string, SERVICE_ROLE: string) {
        this.#accessTokenCookieName = "access_token"
        this.#refreshTokenCookieName = "refresh_token"
        this.#authClient = createClient(
            URL,
            SERVICE_ROLE
        )
    }

    async signup(req: AuthRequest) {
        const clientHook = this.#authClient.auth.signUp
        const { data, error } = await clientHook(req)
        return { data, error }
    }

    async login(req: AuthRequest) {
        const clientHook = this.#authClient.auth.signInWithPassword
        const { data, error } = await clientHook(req)
        return { data, error }
    }

    async loginAccessToken(req: AuthRequestProvider) {
        const clientHook = this.#authClient.auth.signInWithIdToken
        const token = req.accessToken ?? ""
        const provider = req.provider
        const { data, error } = await clientHook({ provider, token })
        return { data, error }
    }

    async loginProvider(req: AuthRequestProvider) {
        const clientHook = this.#authClient.auth.signInWithOAuth
        const { data, error } = await clientHook(req)
        return { data, error }
    }

    async refreshSession(req: { refresh_token: string }) {
        const clientHook = this.#authClient.auth.refreshSession
        const { data, error } = await clientHook(req)
        return { data, error }
    }
    async getUser(req: { accessToken: string }) {
        const clientHook = this.#authClient.auth.getUser
        const { data, error } = await clientHook(req.accessToken)
        return { data, error }
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
}