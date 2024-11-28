import type { CreateMessageRoute, ReadListMessagesRoute, ReadMessageRoute, DeleteMessageRoute } from "./messages.routes.ts";
import type { V1RouteHandler } from "../types.ts";
import { Status } from "../../../utils/statusCode.ts";

export const read: V1RouteHandler<ReadMessageRoute> = async (c) => {
    const { id } = c.req.valid("param")
    if (id) {
        return c.json({
            id,
            userId: 1,
            content: 'Hello world!',
            createdAt: new Date().toISOString()
        }, Status.OK)
    } else {
        return c.json({
            success: false,
            message: "Message not found",
        }, Status.NOT_FOUND)
    }
}

export const readList: V1RouteHandler<ReadListMessagesRoute> = async (c) => {
    const { userId } = c.req.valid("query")
    
    const messages = [{
        id: 1,
        userId: 1,
        content: 'Hello world!',
        createdAt: new Date().toISOString()
    }]

    if (userId) {
        const filteredMessages = messages.filter(message => 
            message.userId === Number(userId)
        )
        // Au lieu de retourner NOT_FOUND, on retourne un tableau vide
        return c.json(filteredMessages, Status.OK)
    }

    return c.json(messages, Status.OK)
}

export const create: V1RouteHandler<CreateMessageRoute> = async (c) => {
    const message = c.req.valid("json")
    // TODO: insert message in database
    return c.json({
        ...message,
        id: 1,
        createdAt: new Date().toISOString()
    }, Status.CREATED)
}

export const remove: V1RouteHandler<DeleteMessageRoute> = async (c) => {
    const { id } = c.req.valid("param")
    const { userId } = c.req.valid("query")

    if (id) {
        // TODO: Check if message exists and belongs to user
        // For now, simulating a successful deletion
        return c.body(null, Status.NO_CONTENT)
    } else {
        return c.json({
            success: false,
            message: "Message not found",
        }, Status.NOT_FOUND)
    }
}