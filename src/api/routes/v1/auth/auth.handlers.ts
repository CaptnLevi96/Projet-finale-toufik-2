import type { SignInRoute, SignUpRoute, SignOutRoute, IamRoute } from "./auth.routes.ts";
import type { V1RouteHandler } from "../types.ts";
import { Status } from "../../../utils/statusCode.ts";
import { setAccessTokenCookie, setIdentityCookie, setRefreshTokenCookie, supabase } from "../../../../../lib/authAgent.ts";
import { sign } from "../../../../../lib/jwt.ts";

export const signIn: V1RouteHandler<SignInRoute> = async (c) => {
    const user = c.req.valid("json")
    const { data, error } = await supabase.auth.signInWithPassword({ email: user.email, password: user.password })
    if(!data.session || error) {
        return c.json({
            message: 'Error while logging in',
        }, Status.UNAUTHORIZED)
    }

    // Set cookies
    setAccessTokenCookie({c, session: data.session})
    setRefreshTokenCookie({c, session: data.session})
    setIdentityCookie({c, session: data.session})
    
    return c.json({
        user: await sign({
            ...data.session.user,
            exp: new Date(data.session.expires_in + new Date().getTime())
        }),
        message: 'Logged in successfully',
    }, Status.OK)
}

export const signUp: V1RouteHandler<SignUpRoute> = async (c) => {
    const user = c.req.valid("json")
    const dataBaseAgent = await c.var.databaseAgent

    if(!dataBaseAgent) {
        console.log('no databaseAgent')
        return c.json({
            message: 'Error while signing up',
        }, Status.UNAUTHORIZED)
    }
    const match = []
    // # Check if email already exists
    const emailFound = await dataBaseAgent.collection('users').findOne({
        email: user.email
    })

    if(emailFound) {
        match.push('email')
    }
    // # Check if username already exists
    const usernameFound = await dataBaseAgent.collection('users').findOne({
        username: user.data.username
    })
    if(usernameFound) {
        match.push('username')
    }
    // -- If match, report
    if(match.length) {
        console.log('match')
        return c.json({
            message: 'Error while signing up',
            conflicts: match,
        }, Status.CONFLICT)
    }
    // # Sign up
    const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
        email: user.email,
        password: user.password,
    })
    // -- If sign up failed, report
    if(signUpError || !signUpData.user) {
        console.log('sign up failed')
        return c.json({
            message: 'Error while signing up',
        }, Status.UNAUTHORIZED)
    }
    // # Insert user in database
    const insertResult = await dataBaseAgent.collection('users').insertOne({
        _supabaseId: signUpData.user.id,
        role: 'user',
        ...user.data,
        email: user.email,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
    })
    // -- If insert failed, report
    if(!insertResult.insertedId) {
        console.log('insert failed')
        return c.json({
            message: 'Error while signing up',
        }, Status.UNAUTHORIZED)
    }
    // # Sign in user
    const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({ email: user.email, password: user.password })
    // -- If sign in failed, report
    if(!signInData.session || signInError) {
        console.log('sign in failed')
        return c.json({
            message: 'Error while signing up',
        }, Status.UNAUTHORIZED)
    }
    // -- Update user in supabase with metadata
    await supabase.auth.updateUser({ data: { ...signUpData.user, updatedAt: new Date().toISOString() } })
    // -- Set cookies
    setAccessTokenCookie({c, session: signInData.session})
    setRefreshTokenCookie({c, session: signInData.session})

    console.log('signUpData', signUpData.user)
    return c.json({
        user: await sign({
            ...signInData.user,
            exp: new Date(signInData.session.expires_in + new Date().getTime())
        }),
        message: 'Signup successfully',
    }, Status.OK)
}

export const signOut: V1RouteHandler<SignOutRoute> = async (c) => {
    // # Sign out
    const { error: signOutError } = await supabase.auth.signOut()
    // -- If sign out failed, report
    if(signOutError) {
        return c.json({
            message: 'Error while signing out',
        }, Status.UNAUTHORIZED)
    }
    return c.json({
        message: 'Signout successfully',
    }, Status.OK)
}

export const iAm: V1RouteHandler<IamRoute> = async (c) => {
    if(c.var.databaseAgent && c.var.user) {
        const supabaseUser = c.var.user
        const dataBaseAgent = await c.var.databaseAgent
        const userInfo = await dataBaseAgent.collection('users').findOne({
            _supabaseId: supabaseUser.id
        })
        if(userInfo) {
            return c.json({
                id: supabaseUser.id,
                role: userInfo.role,
                username: userInfo.username,
                message: 'Signed in successfully',
            }, Status.OK)
        } else {
            return c.json({
                message: 'Error while signing out',
            }, Status.UNAUTHORIZED)
        }
    } else {
        return c.json({
            message: 'Error while signing out',
        }, Status.UNAUTHORIZED)
    }
}


