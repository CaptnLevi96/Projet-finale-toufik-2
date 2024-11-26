// index.ts
import createV1App from './createApp.ts'
import router from './users/users.index.ts'

// @ROUTE /v1/..
const v1 = createV1App().
route('/v1', router)
.get('/v1', (c) => {
    return c.redirect('/v1/ui')
})

export type ApiV1Type = typeof v1
export default v1