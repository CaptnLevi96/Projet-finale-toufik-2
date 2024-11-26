import  type { Hook } from '@hono/zod-openapi'
import { Status } from './statusCode.ts'

export const defaultHook: Hook<any, any, any, any> = (result, c)=>{
    if(!result.success){
        return c.json(
            {
                success: false,
                error: result.error.flatten().fieldErrors,
            },
            Status.UNPROCESSABLE_ENTITY
        )
    }
}