import env from './../env.ts';
import { serve } from '@hono/node-server'
import { Hono } from 'hono'

import { web } from './web/index.js'
import { serveEmojiFavicon } from './api/utils/serveEmojiFavicon.ts';

const app = new Hono()

// @ROUTE /Favicon.ico
app.use(serveEmojiFavicon('🚀'))

// @ROUTE /../..
app.route('/',  web)

const port = env.PORT_WEB
console.log(`Server is running on http://localhost:${port}`)

serve({
  fetch: app.fetch,
  port,
})