import { Hono } from 'hono'
import { html, raw } from 'hono/html'

const route = new Hono()

route.get('/home', (c) => {
    return c.text('Hello World!')
  })