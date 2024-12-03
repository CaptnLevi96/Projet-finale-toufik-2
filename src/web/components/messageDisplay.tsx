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

export const Comment = ({message}: {message: MessageData}) => {
    return (
        <div>
            <div>
                <p>{message.userinfo[0].username}</p>
                <div>
                    <button>+</button>
                    <p>{message.likes}</p>
                    <button>-</button>
                </div>
            </div>
            <div>
                <p>{message.text}</p>
                <div>
                    <button> Delete </button>
                </div>
            </div>
        </div>
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
                    <button data-message-id={message._id} data-text={message.text} data-likes={message.likes} onclick="deleteAction(event)"> Delete </button>
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
                    async function deleteAction(event) {
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