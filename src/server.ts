import env from './../env.ts';
import { serve } from '@hono/node-server'
import { Hono } from 'hono'

import { api } from './api/index.js'
import { web } from './web/index.js'
import { serveEmojiFavicon } from './api/utils/serveEmojiFavicon.ts';

const app = new Hono()

// @ROUTE /Favicon.ico
app.use(serveEmojiFavicon('🚀'))

// @ROUTE /api/v1/...
app.route('/', api.v1)

// @ROUTE /../..
app.route('/',  web)


const port = env.PORT
console.log(`Server is running on http://localhost:${port}`)

serve({
  fetch: app.fetch,
  port,
})