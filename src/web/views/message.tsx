import { client } from "../index.tsx"
import { html } from "hono/html"
import { MessageDisplay, MessageDisplayScript, CommentDisplay, CommentDisplayScript } from "../components/messageDisplay.tsx"

export const Message = async ({id}: {id: string}) => {
    const message = await client.api.v1.messages[":id"].$get({
        param: { id }
    }).then((r) => {
        if(r.status === 200){
            return r.json()
        }else {
            return null
        }
    })
    if(!message) {
        return (
            <div>
                <h1>Message does not exist</h1>
            </div>
        )
    }
    return (
        <div>
            {html`
                <script>
                    async function openCommentModal() {
                        const modalBody = document.getElementById('modal-body')
                        const modalTitle = document.getElementById('modal-title')
                        const modalForm = document.createElement('form')
                        modalBody.innerHTML = ''
                        modalTitle.innerHTML = '<h1>New comment</h1>'
                        modalForm.innerHTML = '<textarea name="text" placeholder="Text"></textarea><br /><button id="submit-button">Submit</button>'
                        modalForm.addEventListener('submit', newCommentAction)
                        modalBody.appendChild(modalForm)
                        openModal()
                    }
                    function newCommentAction(event) {
                        event.preventDefault()
                        event.stopPropagation()
                        const formData = new FormData(event.target)
                        const json = {
                            text: formData.get('text'),
                            _messageId: '${id}'
                        }
                        const url = '${client.api.v1.comments.$url({}).origin + client.api.v1.comments.$url({}).pathname}'
                        fetch(url, {
                            method: 'post',
                            headers: {
                                'Content-Type': 'application/json'
                            },
                            body: JSON.stringify(json)
                        })
                        .then(response => response.json())
                        .then(data => {
                            if(data._id) {
                                window.location.reload()
                            }
                        })
                    }
                </script>
            `}
            <div>
                <button onclick="openCommentModal()"> Add a comment </button>
            </div>
            <MessageDisplayScript />
            <MessageDisplay
                title={message.title}
                message={message}
            />
            <CommentDisplayScript />
            {message.comments.map((comment: any) => {
                return (
                    <CommentDisplay
                        message={comment}
                    />
                )
            })}
        </div>
    )
}