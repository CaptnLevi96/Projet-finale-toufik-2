import { Status } from './../../../utils/statusCode.ts';
import { createRoute, z } from '@hono/zod-openapi'
import { defaultErrorJsonContent, jsonContent } from '../../../utils/apiResponses.ts'
import { databaseAgentMiddleware } from '../../../middleware/mongoAgent.middleware.ts';
import { authVerify } from '../../../middleware/authVerify.middleware.ts';

export const commentSchema = z.object({
    _id: z.string().min(1).openapi({
        example: "123",
        param: {
            name: 'id',
            in: 'path',
        }
    }),
    _messageId: z.string().min(1).openapi({
        example: "456",
        description: "ID of the parent message",
        param: {
            name: 'messageId',
            in: 'path',
        }
    }),
    _supabaseId: z.string().min(1).openapi({
        example: "123",
        description: "ID of the comment creator"
    }),
    text: z.string().min(1).openapi({
        example: 'Reply content',
        description: 'Comment content'
    }),
    likes: z.number().openapi({
        example: 0,
        description: 'Number of likes'
    }),
    createdAt: z.string().datetime().openapi({
        example: '2024-03-26T10:30:00Z',
        description: 'Creation date'
    }),
})

const tags = ["Comments"]

export const readList = createRoute({
    path: '/comments/{messageId}',
    method: 'get',
    tags,
    middleware: [
        databaseAgentMiddleware
    ] as const,
    request: {
        params: z.object({
            messageId: commentSchema.shape._messageId
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
    path: '/comments',
    method: 'post',
    tags,
    middleware: [
        databaseAgentMiddleware,
        authVerify
    ] as const,
    request: {
        body: jsonContent(
            commentSchema.omit({ _id: true, _supabaseId: true, createdAt: true, likes: true }),
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
    path: '/comments/{id}',
    method: 'delete',
    tags,
    middleware: [
        databaseAgentMiddleware,
        authVerify
    ] as const,
    request: {
        params: z.object({
            id: commentSchema.shape._id
        })
    },
    responses: {
        [Status.OK]: jsonContent(
            z.object({
                message: z.string(),
            }),
            'Comment successfully deleted'
        ),
        [Status.NOT_FOUND]: defaultErrorJsonContent("Comment not found"),
        [Status.UNAUTHORIZED]: defaultErrorJsonContent("Unauthorized - Only the owner can delete their comment"),
    }
})

export type ReadListCommentsRoute = typeof readList
export type CreateCommentRoute = typeof create
export type DeleteCommentRoute = typeof remove