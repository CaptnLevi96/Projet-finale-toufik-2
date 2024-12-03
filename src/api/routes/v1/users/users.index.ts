import { createV1Router } from "../createApp.ts"
import * as routes from "./users.routes.ts"
import * as handlers from "./users.handlers.ts"

const router = createV1Router()

export default router