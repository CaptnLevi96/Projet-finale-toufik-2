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

web.get('/test', async (c) => {
  const data = await client.v1.auth.signin.$post(
    {
      json: {
        email: 'test@test.com',
        password: 'test',
      }
    }
  ).then((r) => r.json())

  return c.html(
    <div>
      <h1>Login</h1>
      {data?.message}
    </div>
  )
})

web.get('/test2', async (c) => {
  const accessToken = getCookie(c, 'access_token')
  console.log(accessToken)
  const data = await client.v1.auth.test.$get().then((r) => r.json())
  console.log(data)
  return c.html(
    <div>
      {data.message}
      <h1>Logged in</h1>
    </div>
  )
})

export default web