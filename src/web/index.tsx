import { Hono } from 'hono'
import { Content } from './views/home.tsx'
import type { FC } from 'hono/jsx'

export const web = new Hono()

web.get('/', (c) => {
  const messages = "IM A MESSAGE"
  return c.html(<Content messages="bonjour" />)
})

export default web