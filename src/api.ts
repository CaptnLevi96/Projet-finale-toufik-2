import env from './../env.ts';
import { serve } from '@hono/node-server'
import { Hono } from 'hono'

import { api } from './api/index.js'
import { serveEmojiFavicon } from './api/utils/serveEmojiFavicon.ts';

const app = new Hono()

// @ROUTE /Favicon.ico
app.use(serveEmojiFavicon('🚀'))

// @ROUTE /v1/...
app.route('/', api.v1)

const port = env.PORT_API
console.log(`Server is running on http://localhost:${port}`)

serve({
  fetch: app.fetch,
  port,
})