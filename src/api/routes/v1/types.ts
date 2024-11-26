import type { OpenAPIHono, RouteConfig, RouteHandler } from "@hono/zod-openapi"
import type { Env } from "hono";

export interface V1Bindings extends Env {
    variable: {
        // ... bindings passed with (c) => {}
    }
}

export type AppV1OpenAPI = OpenAPIHono<V1Bindings>;
export type V1RouteHandler<R extends RouteConfig> = RouteHandler<R, V1Bindings>;