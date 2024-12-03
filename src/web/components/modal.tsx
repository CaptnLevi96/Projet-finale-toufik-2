import { Style, css } from "hono/css"
import { html } from "hono/html"
import { Fragment } from "hono/jsx/jsx-runtime"

export const Modal = () => {
    return (
        <Fragment>
        <Style>
            {css`
              #modal {
                display: none;
                position: fixed;
                z-index: 1;
                left: 0;
                top: 0;
                width: 100%;
                height: 100%;
                overflow: auto;
                background-color: rgba(0,0,0,0.4);
              }
              #modal::after {
                content: "";
                display: block;
                position: absolute;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background-color: rgba(0,0,0,0.4);
              }
              #modal-header {
                display: flex;
                flex-direction: row;
                width: auto;
                justify-content: space-between;
                align-items: center;
                padding: 2px 16px;
              }
              #modal.show-modal {
                display: block;
              }
              #modal-content {
                position: relative;
                background-color: white;
                margin: 15% auto;
                padding: 20px;
                border: 1px solid #888;
                width: 80%;
                z-index: 2;
              }
            `}
          </Style>
          {html`
            <script>
              function closeModal() {
                console.log("closeModal")
                document.getElementById("modal").classList.remove("show-modal");
              }
              function openModal() {
                console.log("openModal")
                document.getElementById("modal").classList.add("show-modal");
              }
            </script>
          `}
            <div id="modal">
            <div id="modal-content">
                <div id="modal-header">
                <h2>Modal Title</h2>
                <button id="modal-toggle" onclick="closeModal()">X</button>
                </div>
                <div id="modal-body">
                </div>
            </div>
            </div>
        </Fragment>
    )
}