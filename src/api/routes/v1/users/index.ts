// authors.ts
import { Hono } from 'hono'

const users = new Hono()

users.get('/', (c) => c.json('list authors'))
users.post('/', (c) => c.json('create an author', 201))
users.get('/:id', (c) => c.json(`get ${c.req.param('id')}`))

export default users
