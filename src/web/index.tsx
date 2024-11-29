import { Hono } from 'hono'
import { Content } from './views/home.tsx'
import { hc } from 'hono/client'
import type { ApiV1Type } from '../api/routes/v1/index.ts'
import { getCookie } from 'hono/cookie'
export const web = new Hono()


const client = hc<ApiV1Type>('http://localhost:3001/')

web.get('/', (c) => {
  const messages = "IM A MESSAGE"
  return c.html(<Content messages="bonjour" />)
})

export default web