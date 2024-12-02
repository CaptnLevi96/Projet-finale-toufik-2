import env from './../env.ts';
import { serve } from '@hono/node-server'
import { Hono } from 'hono'

import { api } from './api/index.js'
import { serveEmojiFavicon } from './api/utils/serveEmojiFavicon.ts';
import { cors } from 'hono/cors';

const app = new Hono()

// @ROUTE /Favicon.ico
app.use(serveEmojiFavicon('🚀'))
app.use(cors({
  origin: ['http://localhost:3000'],
}))

// @ROUTE /api/v1/...
app.route('/', api.v1)

const port = env.PORT_API
console.log(`Server is running on http://localhost:${port}`)

serve({
  fetch: app.fetch,
  port,
})