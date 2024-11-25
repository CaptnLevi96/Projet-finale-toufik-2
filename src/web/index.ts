import { Hono } from 'hono'
import { html, raw } from 'hono/html'

export const web = new Hono()

web.get('/home', (c) => {
    return c.text('Hello World!')
  })