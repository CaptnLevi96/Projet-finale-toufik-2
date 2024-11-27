import { Status } from './../../../utils/statusCode.ts';
import { createRoute, z } from '@hono/zod-openapi'
import { defaultErrorJsonContent, jsonContent } from '../../../utils/apiResponses.ts'
import { userSchema } from '../users/users.routes.ts'

export const messageSchema = z.object({
    id: z.coerce.number().openapi({
        example: 456,
        param: {
            name: 'id',
            in: 'path',
        }
    }),
    userId: userSchema.shape.id.openapi({
        example: 123,
        description: "ID of the message creator"
    }),
    content: z.string().min(1).openapi({
        example: 'Message content',
        description: 'Message content'
    }),
    createdAt: z.string().datetime().openapi({
        example: '2024-03-26T10:30:00Z',
        description: 'Creation date'
    }),
})

const tags = ["Messages"]

export const read = createRoute({
    path: '/messages/{id}',
    method: 'get',
    tags,
    request: {
        params: z.object({
            id: messageSchema.shape.id
        })
    },
    responses: {
        [Status.OK]: jsonContent(
            messageSchema,
            'Message'
        ),
        [Status.NOT_FOUND]: defaultErrorJsonContent("Message not found"),
        [Status.UNPROCESSABLE_ENTITY]: defaultErrorJsonContent("Invalid input"),
    }
})

export const readList = createRoute({
    path: '/messages',
    method: 'get',
    tags,
    request: {
        query: z.object({
            userId: z.string().optional()
        })
    },
    responses: {
        [Status.OK]: jsonContent(
            z.array(messageSchema),
            'List of messages'
        ),
        [Status.NOT_FOUND]: defaultErrorJsonContent("No messages found"),
    }
})

export const create = createRoute({
    path: '/messages',
    method: 'post',
    tags,
    request: {
        body: jsonContent(
            messageSchema.omit({ id: true, createdAt: true }),
            'Message to create',
            true
        )
    },
    responses: {
        [Status.CREATED]: jsonContent(
            messageSchema,
            'Message created'
        ),
        [Status.UNPROCESSABLE_ENTITY]: defaultErrorJsonContent("Invalid input"),
        [Status.UNAUTHORIZED]: defaultErrorJsonContent("Unauthorized"),
    }
})

export const remove = createRoute({
    path: '/messages/{id}',
    method: 'delete',
    tags,
    request: {
        params: z.object({
            id: messageSchema.shape.id
        }),
        query: z.object({
            userId: userSchema.shape.id
        })
    },
    responses: {
        [Status.NO_CONTENT]: {
            description: 'Message successfully deleted'
        },
        [Status.NOT_FOUND]: defaultErrorJsonContent("Message not found"),
        [Status.UNAUTHORIZED]: defaultErrorJsonContent("Unauthorized - Only the owner can delete their message"),
    }
})

export type ReadMessageRoute = typeof read
export type ReadListMessagesRoute = typeof readList
export type CreateMessageRoute = typeof create
export type DeleteMessageRoute = typeof remove