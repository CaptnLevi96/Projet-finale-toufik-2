import type { z } from "zod"
import type { userSchema } from "../../api/routes/v1/users/users.routes.ts"

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
    console.log(message)
    return (
        <div>
            <div>
                <h1>{title}</h1>
                <p>{message.userinfo[0].username}</p>
                <p>{message.createdAt}</p>
                <div>
                    <button>+</button>
                    <p>{message.likes}</p>
                    <button>-</button>
                </div>
                <button>Reply</button>
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