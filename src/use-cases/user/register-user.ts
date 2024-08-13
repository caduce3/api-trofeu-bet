import { prisma } from "@/lib/prisma";
import { PrismaUsersRepository } from "@/repositories/prisma-users-repository";
import { hash } from "bcryptjs";

interface RegisterUserRequest {
    name: string;
    email: string;
    password: string;
    gender: string;
}

export async function registerUserUseCase (
    { 
        name, 
        email, 
        password,
        gender
    }: RegisterUserRequest) {
        const password_hash = await hash(password, 6)

        const userWithSomeEmail = await prisma.user.findUnique({
            where: {
                email
            }
        })
    
        if(userWithSomeEmail) throw new Error("Esse e-mail já está cadastrado")
    
        const prismaUsersRepository = new PrismaUsersRepository()

        await prismaUsersRepository.create({
            name,
            email,
            gender,
            password: password_hash
        })
    
}