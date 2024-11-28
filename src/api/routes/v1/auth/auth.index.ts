import { createV1Router } from "../createApp.ts"
import { databaseAgentMiddleware } from "../../../middleware/mongoAgent.middleware.ts"
import { authMiddleware } from "../../../middleware/authAgent.middleware.ts"

const router = createV1Router()
.use(databaseAgentMiddleware)
.use(authMiddleware)


export default router