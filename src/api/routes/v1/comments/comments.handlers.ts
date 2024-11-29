import type { CreateCommentRoute, ReadListCommentsRoute, ReadCommentRoute, DeleteCommentRoute } from "./comments.routes.ts";
import type { V1RouteHandler } from "../types.ts";
import { Status } from "../../../utils/statusCode.ts";

export const read: V1RouteHandler<ReadCommentRoute> = async (c) => {
    const { id, messageId } = c.req.valid("param")

    return c.json({
        id: Number(id),
        messageId: Number(messageId),
        userId: 1,
        content: 'This is a reply',
        createdAt: new Date().toISOString()
    }, Status.OK)
}

export const readList: V1RouteHandler<ReadListCommentsRoute> = async (c) => {
    const { messageId } = c.req.valid("param")

    return c.json([{
        id: 1,
        messageId: Number(messageId),
        userId: 1,
        content: 'First reply',
        createdAt: new Date().toISOString()
    },
    {
        id: 2,
        messageId: Number(messageId),
        userId: 2,
        content: 'Second reply',
        createdAt: new Date().toISOString()
    }], Status.OK)
}

export const create: V1RouteHandler<CreateCommentRoute> = async (c) => {
    const { messageId } = c.req.valid("param")
    const data = c.req.valid("json")

    return c.json({
        id: 1,
        messageId: Number(messageId),
        ...data,
        createdAt: new Date().toISOString()
    }, Status.CREATED)
}

export const remove: V1RouteHandler<DeleteCommentRoute> = async (c) => {
    const { id, messageId } = c.req.valid("param")
    const { userId } = c.req.valid("query")

    // Simulating a successful deletion
    // In a real application, you would check if:
    // 1. The message exists
    // 2. The comment exists
    // 3. The user owns the comment
    return c.body(null, Status.NO_CONTENT)
}