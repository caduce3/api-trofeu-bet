import { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";
import { RegisterUserUseCase } from "@/use-cases/user/register-user";
import { PrismaUsersRepository } from "@/repositories/prisma/prisma-users-repository";
import { UserAlreadyExistsError } from "@/use-cases/errors/user-already-exists";
import { AuthenticateUserUseCase } from "@/use-cases/user/authenticate";
import { InvalidCredentialsError } from "@/use-cases/errors/invalid-credentials-error";
import { UserInactive } from "@/use-cases/errors/user-inactive";

export async function authenticateUser(request: FastifyRequest, reply: FastifyReply) {
    const authenticateUserBodySchema = z.object({
        email: z.string().email(),
        password: z.string().min(6)
    })

    const { email, password } = authenticateUserBodySchema.parse(request.body)

    try {
        const prismaUsersRepository = new PrismaUsersRepository()
        const authenticateUserUseCase = new AuthenticateUserUseCase(prismaUsersRepository)

        await authenticateUserUseCase.execute({
            email,
            password
        })

    } catch (error) {
        if(
               error instanceof InvalidCredentialsError 
            || error instanceof UserInactive) {
        
            return reply.status(409).send({message: error.message})
        }
        throw error
    }

    return reply.status(200).send({message: "Usuário autenticado com sucesso!"})
}