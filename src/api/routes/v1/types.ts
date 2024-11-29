import type { RouteConfig, RouteHandler } from "@hono/zod-openapi"
import type { Env } from "hono";
import type { AuthAgent, AuthUserVariable } from "../../../../lib/authAgent.ts";
import type { MongoDb } from "../../../../lib/mongoAgent.ts";


export interface V1Bindings extends Env {
    Variables: {
        // ... bindings passed with (c) => {}: connects set with middleware
        databaseAgent?: MongoDb
        authAgent?: AuthAgent
        user?: AuthUserVariable
    }
}

export type V1RouteHandler<R extends RouteConfig> = RouteHandler<R, V1Bindings>;