import { MongoAgent } from './MongoAgent.ts'

// @Desc 
// - Agent, used to connect to a database
// - Serve db like this: const db = await agent.database()
// @Params
//   - url: string 
//     * Connection url
//   - dbName: string
//     * Database name
export function createMongoAgent(url: string, dbName: string) {
  const agent = new MongoAgent(url, dbName)
  agent.connect()
  return agent
}