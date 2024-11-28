import { createV1Router } from "../createApp.ts"
import * as routes from "./users.routes.ts"
import * as handlers from "./users.handlers.ts"

const router = createV1Router()
.openapi(routes.readList, handlers.readList)
.openapi(routes.read, handlers.read)
.openapi(routes.create, handlers.create)


export default router