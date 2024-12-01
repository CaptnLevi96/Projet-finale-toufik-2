// index.ts
import createV1App from './createApp.ts'
import userRouter from './users/users.index.ts'
import authRouter from './auth/auth.index.ts'
import messagesRouter from './messages/messages.index.ts'
import commentsRouter from './comments/comments.index.ts'

// @ROUTE /api/v1/..
const v1 = createV1App()
    .route('/api/v1', authRouter)
    .route('/api/v1', messagesRouter)
    .route('/api/v1', userRouter)
    .route('/api/v1', commentsRouter)  // Ajout du router des commentaires
    .get('/api/v1', (c) => {
        return c.redirect('/api/v1/ui')
    })

export type ApiV1Type = typeof v1
export default v1