import { ObjectId } from "mongodb";
import { Status } from "../../../utils/statusCode.ts";
import type { V1RouteHandler } from "../types.ts";
import type { CountLikesRoute, RemoveLikesRoute, UpsertLikesRoute } from "./likes.routes.ts";

export const upsert: V1RouteHandler<UpsertLikesRoute> = async (c) => {
    const likes = c.req.valid("json")
    if(!c.var.user || !c.var.databaseAgent){
        return c.json({
            success: false,
            message: "Unauthorized",
        }, Status.UNAUTHORIZED)
    }
    const databaseAgent = await c.var.databaseAgent
    const commentInput = {
        _supabaseId: c.var.user.id,
        _messageId: new ObjectId(likes.messageId),
        increment: likes.increment,
        createdAt: new Date().toISOString()
    }
    const result = await databaseAgent.collection('comments').updateOne({
        _messageId: commentInput._messageId,
        _supabaseId: commentInput._supabaseId
    },{
        $set: {
            increment: commentInput.increment,
        },
        $setOnInsert: {
            _supabaseId: commentInput._supabaseId,
            _messageId: commentInput._messageId,
            createdAt: commentInput.createdAt,
        }
    }, {
        upsert: true
    })
    return c.json(likes, Status.OK) as any
}

export const count: V1RouteHandler<CountLikesRoute> = async (c) => {
    const { messageId } = c.req.valid("query")
    if(!c.var.databaseAgent){
        return c.json({
            success: false,
            message: "Unauthorized",
        }, Status.UNAUTHORIZED)
    }
    const databaseAgent = await c.var.databaseAgent
    const result = await databaseAgent.collection('comments').aggregate([
        {
            $match: {
                _messageId: new ObjectId(messageId),
            }
        },
        {
            $group: {
                _id: "$_messageId",
                count: {
                    $sum: "$increment"
                }
            }
        }
    ]).toArray()
    return c.json({
        count: result[0].count,
    }, Status.OK) as any
}

export const remove: V1RouteHandler<RemoveLikesRoute> = async (c) => {
    const { messageId } = c.req.valid("query")
    if(!c.var.user || !c.var.databaseAgent){
        return c.json({
            success: false,
            message: "Unauthorized",
        }, Status.UNAUTHORIZED)
    }
    const databaseAgent = await c.var.databaseAgent
    const result = await databaseAgent.collection('comments').deleteOne({
        _messageId: new ObjectId(messageId),
        _supabaseId: new ObjectId(c.var.user.id),
    })
    return c.json({
        count: result,
    }, Status.OK) as any
}