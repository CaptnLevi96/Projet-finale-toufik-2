/*
import { serve } from '@hono/node-server'
import { Hono } from 'hono'

import { api } from './api/api.js'

const app = new Hono()

app.route('/v1', api.v1)

const port = 3000
console.log(`Server is running on http://localhost:${port}`)

serve({
  fetch: app.fetch,
  port
}) 
*/