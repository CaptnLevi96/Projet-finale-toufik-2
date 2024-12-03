import type { CreateUserRoute, ReadListUsersRoute, ReadUsersRoute } from "./users.routes.ts";
import type { V1RouteHandler } from "../types.ts";
import { Status } from "../../../utils/statusCode.ts";

type UserRole = "admin" | "user";