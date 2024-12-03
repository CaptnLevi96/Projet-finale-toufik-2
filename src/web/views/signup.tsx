
import { html } from 'hono/html'

interface ViewProps {
    requestUrl: string
}

export const Signup = ({requestUrl}: ViewProps) => {
    return (
        <div>
        <h1>Register</h1>
        <p id='signup-message'>Please create an account</p>
        <form id='signup' >
            <input type='text' name='username' placeholder='Username' />
            <input type='email' name='email' placeholder='Email' />
            <input type='password' name='password' placeholder='Password' />
            <button id='signup-button'> OK </button>
            <button id='cancel-button' onclick="event.preventDefault(); event.stopPropagation(); window.location.href = '/'">Cancel</button>
        </form>
            {html`
            <script>
                function signupAction(event) {
                    event.preventDefault()
                    event.stopPropagation()
                    const formData = new FormData(event.target)
                    const json = {
                        email: formData.get('email'),
                        password: formData.get('password'),
                        data: {
                            username: formData.get('username'),
                        }
                    }
                    fetch('${requestUrl}', {
                        method: 'post',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify(json)
                    })
                    .then(response => response.json())
                    .then(data => {
                        if(data.conflicts) {
                            document.getElementById('signup-message').innerText = 'Your ' + data.conflicts.join(' , ') + ' already exist'
                        } else if(data.user) {
                            window.location.href = '/'
                        } else {
                            document.getElementById('signup-message').innerText = data.message
                        }
                    })
                }
                document.getElementById('signup').addEventListener('submit', signupAction)
            </script>
            `}
        </div>
    )
}
