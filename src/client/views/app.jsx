import { Hono } from 'hono'
import { html, raw } from 'hono/html'




app.get('/home', (c) => {
    return c.text('Hello World!')
  })