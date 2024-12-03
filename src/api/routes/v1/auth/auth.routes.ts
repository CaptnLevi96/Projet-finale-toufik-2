import { createRoute, z } from '@hono/zod-openapi'
import { jsonContent } from '../../../utils/apiResponses.ts'
import { Status } from '../../../utils/statusCode.ts'
import { databaseAgentMiddleware } from '../../../middleware/mongoAgent.middleware.ts'
import { authVerify } from '../../../middleware/authVerify.middleware.ts'

const authUserSchema = z.object({
    email: z.string().openapi({
        example: 'fake@user.com',
    }),
    password: z.string().openapi({
        example: 'password',
    }),
    data: z.object({
        username: z.string().openapi({
            example: 'John Doe',
        })
    }),
})

const tags = ["Auth"]

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
            authUserSchema.omit({data: true}),
            'User to Sign-In',
            true
        )
    },
    tags,
    responses: {
        [Status.OK]: jsonContent(
            z.object({
                user: z.string().openapi({
                    example: 'your-token'
                }),
                message: z.string().openapi({
                    example: 'Login successfully',
                })
            }),
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
    method: 'post',
    request: {
        body: jsonContent(
            authUserSchema,
            'User to Sign-Up',
            true
        )
    },
    tags,
    middleware: [
        databaseAgentMiddleware,
    ] as const,
    responses: {
        [Status.OK]: jsonContent(
            z.object({
                user: z.string().openapi({
                    example: 'your-token'
                }),
                message: z.string().openapi({
                    example: 'Signup successfully',
                })
            }),
            'Signup successfully'
        ),
        [Status.UNAUTHORIZED]: jsonContent(
            authActionMessage,
            'Invalid input'
        ),
        [Status.CONFLICT]: jsonContent(
            z.object({
                message: z.string().openapi({
                    example: 'Error while signing up',
                }),
                conflicts: z.array(z.string()).openapi({
                    example: ['email'],
                })
            }),
            'Error while signing up'
        ),
    }
})

export const signOut = createRoute({
    path: '/auth/signout',
    method: 'get',
    tags,
    responses: {
        [Status.OK]: jsonContent(
            authActionMessage,
            'Signout successfully'
        ),
        [Status.UNAUTHORIZED]: jsonContent(
            authActionMessage,
            'Invalid input'
        ),
    }
})

export const iAm = createRoute({
    path: '/auth/iam',
    method: 'get',
    tags,
    middleware: [
        authVerify,
        databaseAgentMiddleware,
    ] as const,
    responses: {
        [Status.OK]: jsonContent(
            z.object({
                _supabaseId: z.string().openapi({
                    example: 'your-id'
                }),
                role: z.string().openapi({
                    example: 'your-role'
                }),
                username: z.string().openapi({
                    example: 'your-username'
                }),
                message: z.string().openapi({
                    example: 'Signup successfully',
                })
            }),
            'Signup successfully'
        ),
        [Status.UNAUTHORIZED]: jsonContent(
            authActionMessage,
            'Invalid input'
        ),
    }
})

export type SignInRoute = typeof signIn
export type SignUpRoute = typeof signUp
export type SignOutRoute = typeof signOut
export type IamRoute = typeof iAm