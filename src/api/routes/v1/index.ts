// index.ts
import createV1App from './createApp.ts'
import userRouter from './users/users.index.ts'
import authRouter from './auth/auth.index.ts'
import messagesRouter from './messages/messages.index.ts'
import commentsRouter from './comments/comments.index.ts'

// @ROUTE /v1/..
const v1 = createV1App()
    .route('/v1', authRouter)
    .route('/v1', messagesRouter)
    .route('/v1', userRouter)
    .route('/v1', commentsRouter)  // Ajout du router des commentaires
    .get('/v1', (c) => {
        return c.redirect('/v1/ui')
    })

export type ApiV1Type = typeof v1
export default v1