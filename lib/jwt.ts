import { decode as honoDecode, sign as honoSign, verify as honoVerify } from "hono/jwt"
import env from "../env.ts"

export function sign(payload:any){
    return honoSign(payload, env.JWT_SECRET)
}

export function verify(token:string){
    return honoVerify(token, env.JWT_SECRET)
}

export function decode(token:string){
    return honoDecode(token)
}