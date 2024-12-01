import type { RouteConfig, RouteHandler } from "@hono/zod-openapi"
import type { Env } from "hono";
import type { MongoDb } from "../../../../lib/mongoAgent.ts";
import type { AuthUserVariable } from "../../middleware/authVerify.middleware.ts";

export interface V1Bindings extends Env {
    Variables: {
        // ... bindings passed with (c) => {}: connects set with middleware
        databaseAgent?: MongoDb
        user?: AuthUserVariable
    }
}

export type V1RouteHandler<R extends RouteConfig> = RouteHandler<R, V1Bindings>;