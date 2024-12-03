import type { CreateCommentRoute, ReadListCommentsRoute, DeleteCommentRoute } from "./comments.routes.ts";
import type { V1RouteHandler } from "../types.ts";
import { Status } from "../../../utils/statusCode.ts";
import { ObjectId } from "mongodb";

export const readList: V1RouteHandler<ReadListCommentsRoute> = async (c) => {
    const { messageId } = c.req.valid("param")
    if(!c.var.databaseAgent || !c.var.user) {
        return c.json({
            success: false,
            message: "Unauthorized access",
        }, Status.UNAUTHORIZED)
    }
    const databaseAgent = await c.var.databaseAgent
    const comments = await databaseAgent.collection('comments').aggregate([
        {
            $match: {
                _messageId: messageId
            }
        },
        {
            $lookup: {
                from: 'users',
                localField: '_supabaseId',
                foreignField: '_supabaseId',
                as: 'userinfo'
            }
        }
    ]).toArray()
    return c.json(comments, Status.OK) as any
}

export const create: V1RouteHandler<CreateCommentRoute> = async (c) => {
    const comment = c.req.valid("json")
    if(!c.var.databaseAgent || !c.var.user) {
        return c.json({
            success: false,
            message: "Unauthorized access",
        }, Status.UNAUTHORIZED)
    }
    const databaseAgent = await c.var.databaseAgent
    const commentInput = {
        _supabaseId: c.var.user.id,
        _messageId: new ObjectId(comment._messageId),
        text: comment.text,
        likes: 0,
        createdAt: new Date().toISOString()
    }
    const result = await databaseAgent.collection('comments').insertOne(commentInput)
    return c.json({
        _id: result.insertedId.toString(),
        ...commentInput,
    }, Status.CREATED)
}

export const remove: V1RouteHandler<DeleteCommentRoute> = async (c) => {
    const { id } = c.req.valid("param")
    if(!c.var.databaseAgent || !c.var.user) {
        return c.json({
            success: false,
            message: "Unauthorized access",
        }, Status.UNAUTHORIZED)
    }
    const databaseAgent = await c.var.databaseAgent
    if (id) {
        const res = await databaseAgent.collection('comments').deleteOne({ _id: new ObjectId(id) })
        return c.json({
            message: 'Comment successfully deleted',
        }, Status.OK)
    } else {
        return c.json({
            success: false,
            message: "Comment not found",
        }, Status.NOT_FOUND)
    }
}