import { Status } from './../../../utils/statusCode.ts';
import { createRoute, z } from '@hono/zod-openapi'
import { defaultErrorJsonContent, jsonContent } from '../../../utils/apiResponses.ts'
import { messageSchema } from '../messages/messages.routes.ts'
import { databaseAgentMiddleware } from '../../../middleware/mongoAgent.middleware.ts';

export const commentSchema = z.object({
    id: z.coerce.number().openapi({
        example: 789,
        param: {
            name: 'id',
            in: 'path',
        }
    }),
    messageId: z.coerce.number().openapi({
        example: 456,
        description: "ID of the parent message",
        param: {
            name: 'messageId',
            in: 'path',
        }
    }),
    userId: z.coerce.number().openapi({
        example: 123,
        description: "ID of the comment creator"
    }),
    content: z.string().min(1).openapi({
        example: 'Reply content',
        description: 'Comment content'
    }),
    createdAt: z.string().datetime().openapi({
        example: '2024-03-26T10:30:00Z',
        description: 'Creation date'
    }),
})

const tags = ["Comments"]

export const read = createRoute({
    path: '/messages/{messageId}/comments/{id}',
    method: 'get',
    tags,
    middleware: [
        databaseAgentMiddleware
    ] as const,
    request: {
        params: z.object({
            messageId: commentSchema.shape.messageId,
            id: commentSchema.shape.id
        })
    },
    responses: {
        [Status.OK]: jsonContent(
            commentSchema,
            'Comment'
        ),
        [Status.NOT_FOUND]: defaultErrorJsonContent("Comment not found"),
        [Status.UNPROCESSABLE_ENTITY]: defaultErrorJsonContent("Invalid input"),
    }
})

export const readList = createRoute({
    path: '/messages/{messageId}/comments',
    method: 'get',
    tags,
    middleware: [
        databaseAgentMiddleware
    ] as const,
    request: {
        params: z.object({
            messageId: commentSchema.shape.messageId
        })
    },
    responses: {
        [Status.OK]: jsonContent(
            z.array(commentSchema),
            'List of comments'
        ),
        [Status.NOT_FOUND]: defaultErrorJsonContent("No comments found"),
    }
})

export const create = createRoute({
    path: '/messages/{messageId}/comments',
    method: 'post',
    tags,
    middleware: [
        databaseAgentMiddleware
    ] as const,
    request: {
        params: z.object({
            messageId: commentSchema.shape.messageId
        }),
        body: jsonContent(
            commentSchema.omit({ id: true, messageId: true, createdAt: true }),
            'Comment to create',
            true
        )
    },
    responses: {
        [Status.CREATED]: jsonContent(
            commentSchema,
            'Comment created'
        ),
        [Status.UNPROCESSABLE_ENTITY]: defaultErrorJsonContent("Invalid input"),
        [Status.UNAUTHORIZED]: defaultErrorJsonContent("Unauthorized"),
    }
})

export const remove = createRoute({
    path: '/messages/{messageId}/comments/{id}',
    method: 'delete',
    tags,
    middleware: [
        databaseAgentMiddleware
    ] as const,
    request: {
        params: z.object({
            messageId: commentSchema.shape.messageId,
            id: commentSchema.shape.id
        }),
        query: z.object({
            userId: commentSchema.shape.userId
        })
    },
    responses: {
        [Status.NO_CONTENT]: {
            description: 'Comment successfully deleted'
        },
        [Status.NOT_FOUND]: defaultErrorJsonContent("Comment not found"),
        [Status.UNAUTHORIZED]: defaultErrorJsonContent("Unauthorized - Only the owner can delete their comment"),
    }
})

export type ReadCommentRoute = typeof read
export type ReadListCommentsRoute = typeof readList
export type CreateCommentRoute = typeof create
export type DeleteCommentRoute = typeof remove