import { Status } from './../../../utils/statusCode.ts';
import { createRoute, z } from '@hono/zod-openapi'
import { defaultErrorJsonContent, jsonContent } from '../../../utils/apiResponses.ts'

export const userSchema = z.object({
    id: z.coerce.number().openapi({
        example: 123,
        param: {
            name: 'id',
            in: 'path',
        }
    }),
    role: z.enum(['admin', 'user']).openapi({
        example: 'user',
    }),
    name: z.string().openapi({
        example: 'John Doe',
    }),
    email: z.string().openapi({
        example: 'john.doe@example.com',
    }),
})

const tags = ["Users"]

export const read = createRoute({
    path: '/users/{id}',
    method: 'get',
    tags,
    request: {
        params: z.object({
            id: userSchema.shape.id
        })
    },
    responses: {
        [Status.OK]: jsonContent(
            userSchema,
            'User'
        ),
        [Status.NOT_FOUND]: defaultErrorJsonContent("User not found"),
        [Status.UNPROCESSABLE_ENTITY]: defaultErrorJsonContent("Invalid input"),
    }
})

export const readList = createRoute({
    path: '/users',
    method: 'get',
    tags,
    responses: {
        [Status.OK]: jsonContent(
            z.array(userSchema),
            'List of users'
        ),
    }
})

export const create = createRoute({
    path: '/users',
    method: 'post',
    tags,
    request: {
        body: jsonContent(
            userSchema,
            'User to create',
            true
        )
    },
    responses: {
        [Status.CREATED]: jsonContent(
            userSchema,
            'User created'
        ),
        [Status.UNPROCESSABLE_ENTITY]: defaultErrorJsonContent("Invalid input"),
    }
})



export type ReadUsersRoute = typeof read
export type ReadListUsersRoute = typeof readList
export type CreateUserRoute = typeof create