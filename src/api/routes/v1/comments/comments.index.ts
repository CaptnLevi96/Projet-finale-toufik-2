import { createV1Router } from "../createApp.ts"
import * as routes from "./comments.routes.ts"
import * as handlers from "./comments.handlers.ts"
import { databaseAgentMiddleware } from "../../../middleware/mongoAgent.middleware.ts"

const router = createV1Router()
    .openapi(routes.readList, handlers.readList)
    .openapi(routes.create, handlers.create)
    .openapi(routes.remove, handlers.remove)

export default router