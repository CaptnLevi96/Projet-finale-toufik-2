import { z } from "zod";
import { createRoute } from "@hono/zod-openapi";
import { defaultErrorJsonContent, jsonContent } from "../../../utils/apiResponses.ts";
import { Status } from "../../../utils/statusCode.ts";
import { messageSchema } from "../messages/messages.routes.ts";
import { authVerify } from "../../../middleware/authVerify.middleware.ts";
import { databaseAgentMiddleware } from "../../../middleware/mongoAgent.middleware.ts";

export const likesSchema = z.object({
    _id: z.string().openapi({
        example: "123",
        description: "Likes ID",
    }),
    _messageId: z.string().openapi({
        example: "123",
        description: "Message ID",
    }),
    _supabaseId: z.string().openapi({
        example: "123",
        description: "User ID",
    }),
    increment: z.coerce.number().openapi({
        example: 1,
        description: "Increment value",
    }),
})

const tags = ["Likes"]

export const upsert = createRoute({
    path: '/likes',
    method: 'post',
    tags,
    middleware: [
        databaseAgentMiddleware,
        authVerify,
    ] as const,
    request: {
        body: jsonContent(
            z.object({
                messageId: messageSchema.shape._id,
                supabaseId: likesSchema.shape._supabaseId,
                increment: likesSchema.shape.increment,
            }),
            'Message to create',
            true
        )
    },
    responses: {
        [Status.OK]: jsonContent(
            likesSchema,
            'Likes created'
        ),
        [Status.UNPROCESSABLE_ENTITY]: defaultErrorJsonContent("Invalid input"),
        [Status.UNAUTHORIZED]: defaultErrorJsonContent("Unauthorized"),
    }
})

export const count = createRoute({
    path: '/likes/count',
    method: 'get',
    tags,
    middleware: [
        databaseAgentMiddleware,
    ] as const,
    request: {
        query: z.object({
            messageId: messageSchema.shape._id
        })
    },
    responses: {
        [Status.OK]: jsonContent(
            z.object({
                count: z.number().openapi({
                    example: 123,
                    description: "Likes count",
                }),
            }),
            'Likes count'
        ),
        [Status.NOT_FOUND]: defaultErrorJsonContent("Likes not found"),
        [Status.UNPROCESSABLE_ENTITY]: defaultErrorJsonContent("Invalid input"),
    }
})

export const remove = createRoute({
    path: '/likes',
    method: 'delete',
    tags,
    request: {
        query: z.object({
            messageId: messageSchema.shape._id,
            supabaseId: messageSchema.shape._supabaseId
        })
    },
    responses: {
        [Status.NO_CONTENT]: {
            description: 'Likes successfully deleted'
        },
        [Status.NOT_FOUND]: defaultErrorJsonContent("Likes not found"),
        [Status.UNAUTHORIZED]: defaultErrorJsonContent("Unauthorized - Only the owner can delete their likes"),
    }
})

export type UpsertLikesRoute = typeof upsert
export type CountLikesRoute = typeof count
export type RemoveLikesRoute = typeof remove