type MessageData = {
    text: string,
    username: string,
    likes: number,
    createdAt: string,
}

type MessageProps = {
    title: string,
    message: MessageData,
    comments: MessageData[],
}

export const Comment = ({message}: {message: MessageData}) => {
    return (
        <div>
            <div>
                <p>{message.username}</p>
                <div>
                    <button>+</button>
                    <p>{message.likes}</p>
                    <button>-</button>
                </div>
            </div>
            <div>
                <p>{message.text}</p>
                <div>
                    <button> Delete </button>
                </div>
            </div>
        </div>
    )
}

export const MessageDisplay = ({title, message, comments}: MessageProps) => {
    return (
        <div>
            <div>
                <h1>{title}</h1>
                <p>{message.username}</p>
                <div>
                    <button>+</button>
                    <p>{message.likes}</p>
                    <button>-</button>
                </div>
            </div>
            <div>
                <p>{message.text}</p>
                <div>
                    <button> Delete </button>
                </div>
            </div>
        </div>
    )
}