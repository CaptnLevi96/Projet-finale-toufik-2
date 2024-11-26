import { config } from "dotenv"
import { expand } from "dotenv-expand"

export const serveConfig = () => expand(config())