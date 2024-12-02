import  type { Hook } from '@hono/zod-openapi'
import { Status } from './statusCode.ts'

export const defaultHook: Hook<any, any, any, any> = async (result, c)=>{
    const test = await c.req.json()
    if(!result.success){
        console.log(result.error.flatten().fieldErrors, )
        return c.json(
            {
                success: false,
                error: result.error.flatten().fieldErrors,
            },
            Status.UNPROCESSABLE_ENTITY
        )
    }
}