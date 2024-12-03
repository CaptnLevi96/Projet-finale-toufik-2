import type { CreateMessageRoute, ReadListMessagesRoute, ReadMessageRoute, DeleteMessageRoute, messageSchema } from "./messages.routes.ts";
import type { V1RouteHandler } from "../types.ts";
import { Status } from "../../../utils/statusCode.ts";

export const read: V1RouteHandler<ReadMessageRoute> = async (c) => {
    const { id } = c.req.valid("param")
    if (id) {
        return c.json({
            _id: '123',
            _supabaseId: '123',
            likes: 0,
            title: 'Hello world!',
            text: 'Hello world!',
            createdAt: new Date().toISOString(),
            userinfo: [{ username: 'John Doe' } as any]
        }, Status.OK)
    } else {
        return c.json({
            success: false,
            message: "Message not found",
        }, Status.NOT_FOUND)
    }
}

export const readList: V1RouteHandler<ReadListMessagesRoute> = async (c) => {    
    if(!c.var.databaseAgent) {
        return c.json({
            success: false,
            message: "Database not found",
        }, Status.UNAUTHORIZED)
    }
    const databaseAgent = await c.var.databaseAgent
    const messages = await databaseAgent.collection('messages').aggregate([
        {
            $lookup: {
                from: 'users',
                localField: '_supabaseId',
                foreignField: '_supabaseId',
                as: 'userinfo'
            }
        }
    ]).toArray()

    return c.json(messages, Status.OK) as any
}

export const create: V1RouteHandler<CreateMessageRoute> = async (c) => {
    const message = c.req.valid("json")
    const user = c.var.user
    if(!user || !c.var.databaseAgent) {
        return c.json({
            success: false,
            message: "User not found",
        }, Status.UNAUTHORIZED)
    }
    const databaseAgent = await c.var.databaseAgent
    const messageInput = {
        _supabaseId: user.id,
        title: message.title,
        text: message.text,
        likes: 0,
        createdAt: new Date().toISOString()
    }
    const result = await databaseAgent.collection('messages').insertOne(messageInput)
    // TODO: insert message in database
    return c.json({
        _id: result.insertedId.toString(),
        ...messageInput,
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