import { Hono } from 'hono'
import { Content } from './views/home.tsx'
import { hc } from 'hono/client'
import type { ApiV1Type } from '../api/routes/v1/index.ts'
import { Status } from '../api/utils/statusCode.ts'

export const web = new Hono()

const client = hc<ApiV1Type>('http://localhost:3001/')

web.get('/', (c) => {
  const messages = "IM A MESSAGE"
  return c.html(<Content messages="bonjour" />)
})

web.get('/users', async (c) => {
  const data = await client.v1.users.$post({
    json: {
      id: 1,
      name: 'Mr nouveau',
      role: 'user',
      email: 'Mr.nouveau@example.com',
    }
  })

  switch(data.status){
    case Status.CREATED:
      const user = await data.json()
      return c.html(
        <div>
          <h1>User created</h1>
          <p>ID: {user.id}</p>
          <p>Name: {user.name}</p>
          <p>Email: {user.email}</p>
        </div>
      )
    case Status.UNPROCESSABLE_ENTITY:
      const error = await data.json()
      return c.html(
        <div>
          <h1>Error</h1>
          <p>Message: {error.message}</p>
        </div>
      )
  }
})

export default web