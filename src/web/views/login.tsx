import { html } from 'hono/html'

interface ViewProps {
    requestUrl: string
}

export const Login = ({requestUrl}: ViewProps) => {
    return (
        <div>
        <form id='login' >
            <input type='text' name='email' placeholder='Email' />
            <input type='password' name='password' placeholder='Password' />
            <button id='increment'>Increment</button>
        </form>
        {html`
          <script>
            function loginAction(event) {
                event.preventDefault()
                event.stopPropagation()
                const formData = new FormData(event.target)
                const json = {
                    email: formData.get('email'),
                    password: formData.get('password'),
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
                    if(data.user) {
                        window.location.href = '/'
                    }
                })
            }
            document.getElementById('login').addEventListener('submit', loginAction)
          </script>
        `}
      </div>
    )
}
