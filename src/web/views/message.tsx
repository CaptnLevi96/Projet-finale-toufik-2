import { client } from "../index.tsx"
import { html } from "hono/html"
import { MessageDisplay, MessageDisplayScript } from "../components/messageDisplay.tsx"

export const Message = async ({id}: {id: string}) => {
    const messages = await client.api.v1.messages.$get({
        params: {
            id
        }
    }).then((r) => {
        if(r.status === 200){
            return r.json()
        }else {
            return null
        }
    })
    const message = messages
    if(!messages) {
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
                        modalForm.innerHTML = '<input type="text" name="title" placeholder="Title" /><br /><textarea name="text" placeholder="Text"></textarea><br /><button id="submit-button">Submit</button>'
                        modalForm.addEventListener('submit', newCommentAction)
                        modalBody.appendChild(modalForm)
                        openModal()
                    }
                    function newCommentAction(event) {
                        event.preventDefault()
                        event.stopPropagation()
                        console.log('newCommentAction')
                        const formData = new FormData(event.target)
                        const json = {
                            title: formData.get('title'),
                            text: formData.get('text'),
                            messageId: '${message._id}'
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
                                window.location.href = '/'
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
                title={messages[0].title}
                message={messages[0]}
            />
        </div>
    )
}