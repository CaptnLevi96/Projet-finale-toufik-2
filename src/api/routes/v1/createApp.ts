import { OpenAPIHono } from "@hono/zod-openapi";
import { defaultHook } from "../../utils/defaultHook.ts";
import { swaggerUI } from "@hono/swagger-ui";

export function createV1Router() {
    return new OpenAPIHono({
        strict: false,
        defaultHook: defaultHook
    })
}

export default function createV1App() {
    const v1 = createV1Router()
    // @Desc - Publish the openapi.json
    .doc("/v1/doc", {
        openapi: "3.0.0",
        info: {
            title: "API V1",
            version: "1.0.0",
        },
    })
    // @Desc - Visually extends the openapi.json
    .get('/v1/ui', swaggerUI({url: '/v1/doc'}))
    return v1
}