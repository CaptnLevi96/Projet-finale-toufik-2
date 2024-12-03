import { Status } from './../../../utils/statusCode.ts';
import { createRoute, z } from '@hono/zod-openapi'
import { defaultErrorJsonContent, jsonContent } from '../../../utils/apiResponses.ts'
import { databaseAgentMiddleware } from '../../../middleware/mongoAgent.middleware.ts';
import { authVerify } from '../../../middleware/authVerify.middleware.ts';
import { userSchema } from '../users/users.routes.ts';
import { commentSchema } from '../comments/comments.routes.ts';

export const messageSchema = z.object({
    _id: z.string().min(1).openapi({
        example: "123",
        param: {
            name: 'id',
            in: 'path',
        }
    }),
    _supabaseId: z.string().min(1).openapi({
        example: "123",
        description: "ID of the message creator",
    }),
    likes: z.number().openapi({
        example: 0,
        description: 'Number of likes'
    }),
    title: z.string().min(1).openapi({
        example: 'Message title',
        description: 'Message title'
    }),
    text: z.string().min(1).openapi({
        example: 'Message content',
        description: 'Message content'
    }),
    createdAt: z.string().openapi({
        example: '2024-03-26T10:30:00Z',
        description: 'Creation date'
    }),
    userinfo: z.array(userSchema).openapi({
        description: 'User information'
    }),
    comments: z.array(commentSchema).openapi({
        description: 'Comments'
    }),
})

const tags = ["Messages"]

export const read = createRoute({
    path: '/messages/{id}',
    method: 'get',
    tags,
    middleware: [
        databaseAgentMiddleware,
    ] as const,
    request: {
        params: z.object({
            id: messageSchema.shape._id
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
    middleware: [
        databaseAgentMiddleware
    ] as const,
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
    middleware: [
        databaseAgentMiddleware,
        authVerify
    ] as const,
    request: {
        body: jsonContent(
            messageSchema.omit({ _id: true, _supabaseId: true, likes: true,  createdAt: true, userinfo: true, comments: true }),
            'Message to create',
            true
        )
    },
    responses: {
        [Status.CREATED]: jsonContent(
            messageSchema.omit({ userinfo: true, comments: true }),
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
    middleware: [
        databaseAgentMiddleware,
        authVerify,
    ] as const,
    request: {
        params: z.object({
            id: messageSchema.shape._id
        })
    },
    responses: {
        [Status.OK]: jsonContent(
            z.object({
                message: z.string(),
            }),
            'Message successfully deleted'
        ),
        [Status.NOT_FOUND]: defaultErrorJsonContent("Message not found"),
        [Status.UNAUTHORIZED]: defaultErrorJsonContent("Unauthorized - Only the owner can delete their message"),
    }
})

export type ReadMessageRoute = typeof read
export type ReadListMessagesRoute = typeof readList
export type CreateMessageRoute = typeof create
export type DeleteMessageRoute = typeof remove