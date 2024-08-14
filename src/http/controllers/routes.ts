import { FastifyInstance } from "fastify";
import { registerUser } from "./user/register";
import { authenticateUser } from "./user/authenticate";

export async function appRoutes(app: FastifyInstance) {
    app.post('/users', registerUser)
    app.post('/sessions', authenticateUser)
}