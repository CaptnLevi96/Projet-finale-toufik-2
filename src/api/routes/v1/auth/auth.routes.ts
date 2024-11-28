import { createRoute, z } from '@hono/zod-openapi'
import { jsonContent } from '../../../utils/apiResponses.ts'
import { userSchema } from '../users/users.routes.ts'
import { Status } from '../../../utils/statusCode.ts'

const authUserSchema = z.object({
    email: z.string().openapi({
        example: 'fake@user.com',
    }),
    password: z.string().openapi({
        example: 'password',
    }),
    data: z.object({
        name: z.string().openapi({
            example: 'John Doe',
        })
    }).optional().openapi({
        example: {
            name: 'John Doe',
        }
    }),
})

const providersArray = [ 'google' ] as const

const authProviderSchema = z.object({
    provider: z.enum(providersArray).openapi({
        example: 'google',
    }),
    token: z.string().openapi({
        example: 'secret-token',
    }),
    accessToken: z.string().optional().openapi({
        example: 'ultra-secret-token',
    }),
})

const authActionMessage = z.object({
    message: z.string().openapi({
        example: 'Login successfully',
    }),
})

export const signIn = createRoute({
    path: '/auth/signin',
    method: 'post',
    request: {
        body: jsonContent(
            authUserSchema,
            'User to Sign-In',
            true
        )
    },
    responses: {
        [Status.OK]: jsonContent(
            authActionMessage,
            'Login successfully'
        ),
        [Status.UNAUTHORIZED]: jsonContent(
            authActionMessage,
            'Invalid input'
        ),
    }
})

export const signInWithProvider = createRoute({
    path: '/auth/signin/provider',
    method: 'post',
    request: {
        body: jsonContent(
            authUserSchema,
            'User to Sign-In',
            true
        )
    },
    responses: {
        [Status.OK]: jsonContent(
            authActionMessage,
            'Login successfully'
        ),
        [Status.UNAUTHORIZED]: jsonContent(
            authActionMessage,
            'Invalid input'
        ),
    }
})

export const signUp = createRoute({
    path: '/auth/signup',
    method: 'get',
    request: {
        body: jsonContent(
            authUserSchema,
            'User to Sign-Up',
            true
        )
    },
    responses: {
        [200]: jsonContent(
            authActionMessage,
            'Signup successfully'
        ),
        [403]: jsonContent(
            authActionMessage,
            'Invalid input'
        ),
    }
})

export const refresh = createRoute({
    path: '/auth/refresh',
    method: 'get',
    responses: {
        [200]: jsonContent(
            authActionMessage,
            'Refresh successfully'
        ),
        [403]: jsonContent(
            authActionMessage,
            'Invalid input'
        ),
    }
})

export const signOut = createRoute({
    path: '/auth/signout',
    method: 'get',
    responses: {
        [200]: jsonContent(
            authActionMessage,
            'Signout successfully'
        ),
        [403]: jsonContent(
            authActionMessage,
            'Invalid input'
        ),
    }
})

export type SignInRoute = typeof signIn
export type SignInWithProviderRoute = typeof signInWithProvider
export type SignUpRoute = typeof signUp
export type SignOutRoute = typeof signOut
export type RefreshRoute = typeof refresh
