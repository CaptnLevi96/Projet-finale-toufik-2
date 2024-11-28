import { createV1Router } from "../createApp.ts"
import { databaseAgentMiddleware } from "../../../middleware/mongoAgent.middleware.ts"

const router = createV1Router()
.use(databaseAgentMiddleware)


export default router