import { createV1Router } from "../createApp.ts"
import * as routes from "./users.routes.ts"
import * as handlers from "./users.handlers.ts"
import { databaseAgentMiddleware } from "../../../middleware/mongoAgent.middleware.ts"

const router = createV1Router()
.openapi(routes.readList, handlers.readList)
.openapi(routes.read, handlers.read)
.openapi(routes.create, handlers.create)
.use(databaseAgentMiddleware)


export default router