import { createV1Router } from "../createApp.ts"
import * as routes from "./auth.routes.ts"
import * as handlers from "./auth.handlers.ts"

const router = createV1Router()
.openapi(routes.signIn, handlers.signIn)
.openapi(routes.signUp, handlers.signUp)
.openapi(routes.signOut, handlers.signOut)
.openapi(routes.iAm, handlers.iAm)

export default router