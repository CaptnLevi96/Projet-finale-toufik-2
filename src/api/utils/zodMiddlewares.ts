export function zodMiddlewares(middlewares: any[]) {
    return [...middlewares] as const
}