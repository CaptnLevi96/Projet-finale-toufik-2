import { createV1Router } from "../createApp.ts"
import * as routes from "./likes.routes.ts"
import * as handlers from "./likes.handlers.ts"

const router = createV1Router()
    .openapi(routes.upsert, handlers.upsert)
    .openapi(routes.remove, handlers.remove)
    .openapi(routes.count, handlers.count)

export default router