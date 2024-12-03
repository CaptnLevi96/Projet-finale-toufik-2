import { Fragment } from "hono/jsx/jsx-runtime"
import { html } from "hono/html"
import { client } from "../index.tsx"

type LikeProps= {
    messageId: string,
    supabaseId: string,
}

export const LikesComponent = async ({messageId, supabaseId}: LikeProps) => {
    console.log(messageId)
    const count = await client.api.v1.likes.count.$get({
        query: {
            messageId,
        }
    }).then((r) => {
        if(r.status === 200){
            return r.json()
        }else {
            return {count: 0}
        }
    }).then((r) => {
        return r.count
    })

    return (
        <div>
            <button data-message-id={messageId} data-supabase-id={supabaseId} data-increment={1} onclick="likeAction(event)">+</button>
            <p>{count}</p>
            <button data-message-id={messageId} data-supabase-id={supabaseId} data-increment={-1} onclick="likeAction(event)">-</button>
        </div>
    )
}

export const LikesComponentScript = () => {
    const origin = client.api.v1.likes.$url({}).origin
    const url = origin + client.api.v1.likes.$url({}).pathname
    return (
        <Fragment>
            {html`
                <script>
                    async function likeAction(event) {
                        const url = "${url}"
                        const messageId = event.target.dataset.messageId;
                        const supabaseId = event.target.dataset.supabaseId;
                        const increment = event.target.dataset.increment;
                        await fetch(url, {
                            method: 'post',
                            headers: {
                                'Content-Type': 'application/json'
                            },
                            body: JSON.stringify({
                                messageId,
                                supabaseId,
                                increment
                            })
                        }).then(()=> {window.location.href = '/'})
                    }
                </script>
            `}
        </Fragment>
    )
}
