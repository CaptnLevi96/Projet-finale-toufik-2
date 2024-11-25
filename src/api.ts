import { serve } from '@hono/node-server'
import { Hono } from 'hono'

import { api } from './api/index.js'

const app = new Hono()

app.route('/v1', api.v1)

const port = 3001
console.log(`Server is running on http://localhost:${port}`)

serve({
  fetch: app.fetch,
  port
})