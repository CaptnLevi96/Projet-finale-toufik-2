import { createMiddleware } from "hono/factory"
import type { V1Bindings } from "../routes/v1/types.ts"
import { createMongoAgent } from "../../../lib/MainAgent.ts"
import env from "../../../env.ts"

const mongoAgent = createMongoAgent(env.DATABASE_URL, env.DATABASE_NAME)
export const databaseAgentMiddleware = createMiddleware<V1Bindings>(async (c, next) => {
    try {
        await mongoAgent.connect()
        const db = await mongoAgent.database()        
        c.set('databaseAgent', db)
    }catch(e){
        console.error(e)
        c.set('databaseAgent', null)
    }

    await next()
})