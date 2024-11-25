import type { FC } from 'hono/jsx'

export const Layout: FC = (props) => {
    return (
      <html>
        Im a header
        <body>{props.children}</body>
      </html>
    )
  }