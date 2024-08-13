import { FastifyReply, FastifyRequest } from "fastify";
import { prisma } from '@/lib/prisma'
import { hash } from "bcryptjs";
import { z } from "zod";
import { RegisterUserUseCase } from "@/use-cases/user/register-user";
import { PrismaUsersRepository } from "@/repositories/prisma-users-repository";

export async function registerUser(request: FastifyRequest, reply: FastifyReply) {
    const registerUserBodySchema = z.object({
        name: z.string(),
        gender: z.string(),
        email: z.string().email(),
        password: z.string().min(6)
    })

    const { name, email, password, gender} = registerUserBodySchema.parse(request.body)

    try {
        const prismaUsersRepository = new PrismaUsersRepository()
        const registerUserUseCase = new RegisterUserUseCase(prismaUsersRepository)

        await registerUserUseCase.execute({
            name,
            email,
            password,
            gender
        })

    } catch (error) {
        return reply.status(409).send()
    }

    return reply.status(201).send({message: "Usuário cadastrado com sucesso! Entre em contato com o time de desenvolvimento para ativar sua conta."})
}