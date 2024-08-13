import { FastifyInstance } from "fastify";
import { registerUser } from "./register";

export async function appRoutes(app: FastifyInstance) {
    app.post('/users', registerUser)
}