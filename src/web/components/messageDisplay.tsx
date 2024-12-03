import type { z } from "zod"
import { client } from "../index.tsx"
import { html } from "hono/html"
import type { userSchema } from "../../api/routes/v1/users/users.routes.ts"
import { Fragment } from "hono/jsx/jsx-runtime"

type MessageData = {
    _id: string,
    _supabaseId: string,
    text: string,
    likes: number,
    userinfo: Array<z.infer<typeof userSchema>>,
    createdAt: string,
}

type MessageProps = {
    title: string,
    message: MessageData,
}

export const CommentDisplay = ({message}: {message: MessageData}) => {
    return (
        <div>
            <div>
                <p>Comment by {message.userinfo[0].username}</p>
                <div>
                    <button>+</button>
                    <p>{message.likes}</p>
                    <button>-</button>
                </div>
            </div>
            <div>
                <p>{message.text}</p>
                <div>
                    <button data-comment-id={message._id} onclick="deleteCommentAction(event)"> Delete </button>
                </div>
            </div>
        </div>
    )
}

export const CommentDisplayScript = () => {
    const origin =  client.api.v1.comments.$url({}).origin
    const url = origin + client.api.v1.comments.$url({}).pathname
    return (
        <Fragment>
            {html`
                <script>
                    async function deleteCommentAction(event) {
                        const commentId = event.target.dataset.commentId;
                        const url = "${url}" + '/' + commentId
                        await fetch(url, {
                            method: 'delete',
                        }).then(()=> {window.location.reload()})
                    }
                </script>
            `}
        </Fragment>
    )
}

export const MessageDisplay = ({title, message}: MessageProps) => {
    return (
        <div>
            <div>
                <a href={`/messages/${message._id}`}> <h3>{title}</h3></a>
                <p>{message.userinfo[0].username}</p>
                <p>{message.createdAt}</p>
                <div>
                    <button>+</button>
                    <p>{message.likes}</p>
                    <button>-</button>
                </div>
            </div>
            <div>
                <p>{message.text}</p>
                <div>
                    <button data-message-id={message._id} data-text={message.text} data-likes={message.likes} onclick="deleteMessageAction(event)"> Delete </button>
                </div>
            </div>
        </div>
    )
}

export const MessageDisplayScript = () => {
    const origin = client.api.v1.messages.$url({}).origin
    const url = origin + client.api.v1.messages.$url({}).pathname
    return (
        <Fragment>
            {html`
                <script>
                    async function deleteMessageAction(event) {
                        const messageId = event.target.dataset.messageId;
                        const url = "${url}" + '/' + messageId
                        await fetch(url, {
                            method: 'delete',
                        }).then(()=> {window.location.href = '/'})
                    }
                </script>
            `}
        </Fragment>
    )
}