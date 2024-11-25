// index.ts
import { Hono } from 'hono'
import users from './users/index.js'
//import comments from './comments/index.js'

const v1 = new Hono()

// ROUTE /v1/users/...
v1.route('/users', users)

//v1.route('/comments', comments)

export default v1
