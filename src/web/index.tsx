import { Hono } from 'hono'
import { Content } from './views/home.tsx'
import { hc } from 'hono/client'
import type { ApiV1Type } from '../api/routes/v1/index.ts'

export const web = new Hono()

const client = hc<ApiV1Type>('http://localhost:3001/')

web.get('/', (c) => {
  const messages = "IM A MESSAGE"
  return c.html(<Content messages="bonjour" />)
})

web.get('/users', async (c) => {
  const users = await client.v1.users.$get().then((r) => r.json())
  console.log(users)
  return c.html(
  <div>
    {users.map((user) => <div>{user.name}</div>)}
  </div>)
})

export default web