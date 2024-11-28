import { createV1Router } from "../createApp.ts"
import * as routes from "./auth.routes.ts"
import * as handlers from "./auth.handlers.ts"
import { authActions } from "../../../middleware/authActions.middleware.ts"

const router = createV1Router()
.basePath('/auth')
.openapi(routes.signIn, handlers.signIn)
.use('/*', authActions)


export default router