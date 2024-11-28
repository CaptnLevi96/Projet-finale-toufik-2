import { createV1Router } from "../createApp.ts"
import * as routes from "./messages.routes.ts"
import * as handlers from "./messages.handlers.ts"
import { databaseAgentMiddleware } from "../../../middleware/mongoAgent.middleware.ts"

const router = createV1Router()
    .openapi(routes.readList, handlers.readList)
    .openapi(routes.read, handlers.read)
    .openapi(routes.create, handlers.create)
    .openapi(routes.remove, handlers.remove)  // Ajout de la route delete
    .use(databaseAgentMiddleware)

export default router