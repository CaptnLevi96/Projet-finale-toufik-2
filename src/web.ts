import { serve } from '@hono/node-server'
import { Hono } from 'hono'

import { web } from './web/index.js'

const app = new Hono()

app.route('/',  web)

const port = 3000
console.log(`Server is running on http://localhost:${port}`)

serve({
  fetch: app.fetch,
  port
})