import { Hono } from 'hono'
import { jsxRenderer } from 'hono/jsx-renderer'
import { Header } from './components/header.tsx'
import { Login } from './views/login.tsx'
import type { ApiV1Type } from '../api/routes/v1/index.ts'
import { hc } from 'hono/client'
import { Signup } from './views/signup.tsx'

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
      </html>
    )
  })
)

web.get('/', (c) => {
  return c.render(<div id="root">
    <h1>Hello Hono!</h1>
  </div>)
})

web.get('/about', (c) => {
  return c.render(<h1>About me!</h1>)
})

web.get('/login', (c) => {
  const url = client.api.v1.auth.signin.$url({})
  return c.render(<Login requestUrl={url.origin + url.pathname} />)
})

web.get('/signup', (c) => {
  const url = client.api.v1.auth.signup.$url({})
  return c.render(<Signup requestUrl={url.origin + url.pathname} />)
})

export default web