import { Layout } from "../layouts/app.js";
import type { FC } from 'hono/jsx'

interface ContentProps {
    messages: string,

}

export const Content: FC<ContentProps> = (props: ContentProps) => (
    <Layout>
        <h1>Hello World!
            {props.messages}
        </h1>
    </Layout>
)