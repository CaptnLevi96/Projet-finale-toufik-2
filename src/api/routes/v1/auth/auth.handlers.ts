import type { SignInRoute, SignUpRoute, SignOutRoute, RefreshRoute, TestGetUserRoute } from "./auth.routes.ts";
import type { V1RouteHandler } from "../types.ts";
import { Status } from "../../../utils/statusCode.ts";
import { setAccessTokenCookie, setRefreshTokenCookie, supabase } from "../../../../../lib/authAgent.ts";

export const signIn: V1RouteHandler<SignInRoute> = async (c) => {
    const user = c.req.valid("json")
    const { data, error } = await supabase.auth.signInWithPassword({ email: user.email, password: user.password })
    console.log(data, 'data')
    if(error) {
        c.json({
            message: 'Error while logging in',
        }, Status.UNAUTHORIZED)
    }

    // Set cookies
    if(data.session) {
        console.log(data.session, 'data.session')
        setAccessTokenCookie({c, session: data.session})
        setRefreshTokenCookie({c, session: data.session})
    }
    console.log(data.user)
    return c.json({
        message: 'Logged in successfully',
    }, Status.OK)
}

export const signUp: V1RouteHandler<SignUpRoute> = async (c) => {
    const user = c.req.valid("json")
    // TODO: insert user in database
    return c.json({
        message: 'Signup successfully',
    }, Status.OK)
}

export const signOut: V1RouteHandler<SignOutRoute> = async (c) => {
    // TODO: delete user from database
    return c.json({
        message: 'Signout successfully',
    }, Status.OK)
}

export const refresh: V1RouteHandler<RefreshRoute> = async (c) => {
    // TODO: refresh user in database
    return c.json({
        message: 'Refresh successfully',
    }, Status.OK)
}

export const testGetUser: V1RouteHandler<TestGetUserRoute> = async (c) => {
    const user = await c.var.user ?? null
    if(!user) {
        console.log(user)
        return c.json({
            message: 'Error while getting user',
            data: user
        }, Status.UNAUTHORIZED)
    }
    return c.json({
        message: 'User successfully retrieved',
        data: user
    }, Status.OK)
}