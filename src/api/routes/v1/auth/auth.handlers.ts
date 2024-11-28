import type { SignInRoute, SignInWithProviderRoute, SignUpRoute, SignOutRoute, RefreshRoute } from "./auth.routes.ts";
import type { V1RouteHandler } from "../types.ts";
import { Status } from "../../../utils/statusCode.ts";

export const signIn: V1RouteHandler<SignInRoute> = async (c) => {
    const user = c.req.valid("json")
    if(c.var.authAgent) {
        console.log('in signIn')
        const { data, error } = await c.var.authAgent.signIn(user)
        // TODO: insert user in database
        return c.json({
            message: data.user?.id + ' Login successfully',
        }, Status.OK)
    }
    else {
        return c.json({
            message: 'Login failed',
        }, Status.UNAUTHORIZED)
    }

}

export const signInWithProvider: V1RouteHandler<SignInWithProviderRoute> = async (c) => {
    const user = c.req.valid("json")
    // TODO: insert user in database
    return c.json({
        message: 'Login successfully',
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