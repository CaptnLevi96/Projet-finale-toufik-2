import type { OpenAPIHono, RouteConfig, RouteHandler } from "@hono/zod-openapi"
import type { Env } from "hono";
import type { MongoAgent, MongoDb } from "../../../../lib/MongoAgent.ts";

export interface V1Bindings extends Env {
    Variables: {
        // ... bindings passed with (c) => {}: connects set with middleware
        databaseAgent: MongoDb
    }
}

export type V1RouteHandler<R extends RouteConfig> = RouteHandler<R, V1Bindings>;