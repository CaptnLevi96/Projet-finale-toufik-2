import { createV1Router } from "../createApp.ts"
import * as routes from "./auth.routes.ts"
import * as handlers from "./auth.handlers.ts"

const router = createV1Router()
.openapi(routes.signIn, handlers.signIn)
.openapi(routes.testGetUser, handlers.testGetUser)


export default router