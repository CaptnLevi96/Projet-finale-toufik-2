import { html } from 'hono/html'
import { Fragment } from 'hono/jsx/jsx-runtime'
import { client } from '../index.tsx'

export async function Header() {
    const identity = await client.api.v1.auth.iam.$get()
    return (
        <Fragment>
        <header>
            <div>
                <ul>
                    <li><a href='/'>Home</a></li>
                </ul>
            </div>
            <div>
                {identity.status === 200 && (
                    <Fragment>
                        <p>Logged in as {identity?.userName || identity?.userId}</p>
                        <button id='logout-button'>Logout</button>
                    </Fragment>
                )}
                {identity.status !== 200 && (
                    <Fragment>
                        <a href='/login'>Login</a>
                        <a href='/signup'>Signup</a>
                    </Fragment>
                )}
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
            </script>
        `}
        </Fragment>
    )
}