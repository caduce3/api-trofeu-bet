import { FastifyReply, FastifyRequest } from "fastify";
import { prisma } from '@/lib/prisma'
import { hash } from "bcryptjs";
import { z } from "zod";

export async function registerUser(request: FastifyRequest, reply: FastifyReply) {
    const registerUserBodySchema = z.object({
        name: z.string(),
        gender: z.string(),
        email: z.string().email(),
        password: z.string().min(6)
    })

    const { name, email, password, gender} = registerUserBodySchema.parse(request.body)

    const password_hash = await hash(password, 6)

    const userWithSomeEmail = await prisma.user.findUnique({
        where: {
            email
        }
    })

    if(userWithSomeEmail) {
        return reply.status(409).send({ message: 'User already exists' })
    }

    await prisma.user.create({
        data: {
            name,
            email,
            password: password_hash,
            gender
        }
    })

    return reply.status(201).send({ message: 'User created successfully' })
}