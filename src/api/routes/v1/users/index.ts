// authors.ts
import { Hono } from 'hono'

const users = new Hono()

// GET /v1/users
users.get('/', (c) => c.json('list authors'))
// POST /v1/users
users.post('/', (c) => c.json('create an author', 201))
// GET /v1/users/:id
users.get('/:id', (c) => c.json(`get ${c.req.param('id')}`))

export default users
