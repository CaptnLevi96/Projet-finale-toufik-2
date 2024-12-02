import { html } from 'hono/html'


function Counter() {
    return (
        <div>
        <p id='counter'>Count: 0</p>
        <button id='increment'>Increment</button>
        {html`
            <script>
            function increment() {
                const counter = document.getElementById('counter')
                counter.innerText = 'Count: ' + (parseInt(counter.innerText.split(' ')[1]) + 1)
            }
            document.getElementById('increment').addEventListener('click', increment)
            </script>
        `}
        </div>
    )
}