import type { CreateUserRoute, ReadListUsersRoute, ReadUsersRoute } from "./users.routes.ts";
import type { V1RouteHandler } from "../types.ts";
import { Status } from "../../../utils/statusCode.ts";

type UserRole = "admin" | "user";

export const read: V1RouteHandler<ReadUsersRoute> = async (c) => {
    const { id } = c.req.valid("param")
    if (id) {
        return c.json({
            id,
            name: 'John Doe',
            role: 'user' as UserRole,
            email: 'john.doe@example.com',
        }, Status.OK)
    } else {
        return c.json({
            success: false,
            message: "User not found",
        }, Status.NOT_FOUND)
    }
}

export const readList: V1RouteHandler<ReadListUsersRoute> = async (c) => {
    return c.json([{
        id: 1,
        name: 'John Doe',
        role: 'user' as UserRole,
        email: 'john.doe@example.com',
    }])
}