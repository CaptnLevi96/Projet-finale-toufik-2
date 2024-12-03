import { client } from "../index.tsx"
import { MessageDisplay, MessageDisplayScript } from "../components/messageDisplay.tsx"
import { LikesComponentScript } from "../components/like.tsx"

export const List = async ({identity}: {identity: any}) => {
    const messages = await client.api.v1.messages.$get().then((r) => {
        if(r.status === 200){
            return r.json()
        }else {
            return []
        }
    })

    if(messages.length === 0) {
        return (
            <div>
                <h1>No messages</h1>
            </div>
        )
    }
    return (
        <div>
            <LikesComponentScript />
            <MessageDisplayScript />
           {messages.map((message) => {
            return (
                <MessageDisplay
                    title={message.title}
                    message={message}
                    role={identity?.role ?? ''}
                    supabaseId={identity?._supabaseId ?? ''}
                />
            )
           })}
        </div>
    )
}