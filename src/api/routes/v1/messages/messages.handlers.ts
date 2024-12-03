import type { CreateMessageRoute, ReadListMessagesRoute, ReadMessageRoute, DeleteMessageRoute, messageSchema } from "./messages.routes.ts";
import type { V1RouteHandler } from "../types.ts";
import { Status } from "../../../utils/statusCode.ts";
import { ObjectId } from "mongodb";

export const read: V1RouteHandler<ReadMessageRoute> = async (c) => {
    console.log('in read')
    const { id } = c.req.valid("param")
    console.log(id)
    if(!c.var.databaseAgent || !c.var.user) {
        return c.json({
            success: false,
            message: "Unauthorized access",
        }, Status.UNAUTHORIZED)
    }
    const databaseAgent = await c.var.databaseAgent
    if (id) {
        const message = await databaseAgent.collection('messages').aggregate([
            {
                $match: {
                    _id: new ObjectId(id)
                }
            },
            {
                $lookup: {
                    from: 'users',
                    localField: '_supabaseId',
                    foreignField: '_supabaseId',
                    as: 'userinfo'
                }
            },
            {
                $lookup: {
                    from: 'comments',
                    localField: '_id',
                    foreignField: '_messageId',
                    as: 'comments'
                },
            }
        ]).toArray()
        return c.json(message, Status.OK) as any
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
    const { id } = c.req.valid("param") as any
    if(!c.var.databaseAgent || !c.var.user) {
        return c.json({
            success: false,
            message: "Unauthorized access",
        }, Status.UNAUTHORIZED)
    }
    const databaseAgent = await c.var.databaseAgent
    if (id) {
        const res = await databaseAgent.collection('messages').deleteOne({ _id: new ObjectId(id) })
        return c.json({
            message: 'Message successfully deleted',
        }, Status.OK)
    } else {
        return c.json({
            success: false,
            message: "Message not found",
        }, Status.NOT_FOUND)
    }
}