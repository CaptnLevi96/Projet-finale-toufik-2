import { serve } from '@hono/node-server'
import { Hono } from 'hono'

import { web } from './web/index.js'
import env from '../env.ts'
import { serveEmojiFavicon } from './api/utils/serveEmojiFavicon.ts'

const app = new Hono()

// @ROUTE /Favicon.ico
app.use(serveEmojiFavicon('🧱'))

app.route('/',  web)

const port = env.PORT_WEB

serve({
  fetch: app.fetch,
  port
})

console.log(`Server is running on http://localhost:${port}`)
