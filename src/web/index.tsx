import { Hono } from 'hono'
import { jsxRenderer } from 'hono/jsx-renderer'
import { Header } from './components/header.tsx'
import { Login } from './views/login.tsx'
import type { ApiV1Type } from '../api/routes/v1/index.ts'
import { hc } from 'hono/client'
import { Signup } from './views/signup.tsx'
import { List } from './views/list.tsx'
import { Modal } from './components/modal.tsx'
import { Message } from './views/message.tsx'

export const client = hc<ApiV1Type>('http://localhost:3001/')
export const web = new Hono()

web.get(
  '*',
  jsxRenderer(({ children }) => {
    return (
      <html>
        <body>
          <Header />
          <div>{children}</div>
        </body>
        <Modal />
      </html>
    )
  })
)

web.get('/', (c) => {
  return c.render(
    <List />
  )
})

web.get('/login', (c) => {
  const url = client.api.v1.auth.signin.$url({})
  return c.render(<Login requestUrl={url.origin + url.pathname} />)
})

web.get('/signup', (c) => {
  const url = client.api.v1.auth.signup.$url({})
  return c.render(<Signup requestUrl={url.origin + url.pathname} />)
})

web.get('/messages/:id', (c) => {
  return c.render(<Message id={c.req.param('id')} />)
})

export default web