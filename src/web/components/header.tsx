import { html, raw } from 'hono/html'
import { Fragment } from 'hono/jsx/jsx-runtime'
import { client } from '../index.tsx'
import { Status } from '../../api/utils/statusCode.ts'

export async function Header() {
    const identity = await client.api.v1.auth.iam.$get().then((r) => {
        if(r.status === Status.OK){
            return r.json()
        }else {
            return null
        }
    })
    return (
        <Fragment>
        <header>
            <div>
                <h1>Post-it</h1>
            </div>
            <div>
                <div>
                    <button 
                        id='new-message-button'
                        disabled={!identity}
                     >New Message</button>
                </div>
                <div>
                    <input type="text" placeholder="Search..." />
                </div>
                <div>
                    {identity && (
                            <div>
                                <p>Logged in as {identity.username}</p>
                                <button id='logout-button'>Logout</button>
                            </div>
                    )}
                    {!identity && (
                        <div>
                            <a href='/login'>Login</a>
                            <a href='/signup'>Register</a>
                        </div>
                    )}
                </div>
            </div>
        </header>
        
        {html`
            <script>
                const logoutButton = document.getElementById('logout-button')
                logoutButton.addEventListener('click', logoutAction)
                function logoutAction(event) {
                    event.preventDefault()
                    event.stopPropagation()
                    console.log('logout')   
                    const url = '${client.api.v1.auth.signout.$url({}).origin + client.api.v1.auth.signout.$url({}).pathname}'
                    fetch(url, {
                        method: 'get',
                    })
                    .then(()=> {window.location.reload()
                    })
                }
                function newMessageAction(event) {
                    event.preventDefault()
                    event.stopPropagation()
                    console.log('newMessageAction')
                    const formData = new FormData(event.target)
                    const json = {
                        title: formData.get('title'),
                        text: formData.get('text'),
                    }
                    const url = '${client.api.v1.messages.$url({}).origin + client.api.v1.messages.$url({}).pathname}'
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
                function openMessageModal(event) {
                    event.preventDefault()
                    event.stopPropagation()
                    const modalBody = document.getElementById('modal-body')
                    const modalTitle = document.getElementById('modal-title')
                    const modalForm = document.createElement('form')
                    modalBody.innerHTML = ''
                    modalTitle.innerHTML = '<h1>New message</h1>'
                    modalForm.innerHTML = '<input type="text" name="title" placeholder="Title" /><br /><textarea name="text" placeholder="Text"></textarea><br /><button id="submit-button">Submit</button>'
                    modalForm.addEventListener('submit', newMessageAction)
                    modalBody.appendChild(modalForm)
                    openModal()
                }
                
                document.getElementById('new-message-button').addEventListener('click', openMessageModal)
            </script>
        `}
        </Fragment>
    )
}