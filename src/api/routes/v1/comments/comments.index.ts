import { createV1Router } from "../createApp.ts"
import * as routes from "./comments.routes.ts"
import * as handlers from "./comments.handlers.ts"
import { databaseAgentMiddleware } from "../../../middleware/mongoAgent.middleware.ts"

const router = createV1Router()
    .openapi(routes.readList, handlers.readList)
    .openapi(routes.read, handlers.read)
    .openapi(routes.create, handlers.create)
    .openapi(routes.remove, handlers.remove)
    .use(databaseAgentMiddleware)

export default router