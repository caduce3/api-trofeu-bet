import { UsersRepository } from "@/repositories/users-repository";
import { hash } from "bcryptjs";

interface RegisterUserRequest {
    name: string;
    email: string;
    password: string;
    gender: string;
}

export class RegisterUserUseCase {
    constructor(private usersRepository: UsersRepository) {}

    async execute ({ name, email,password, gender}: RegisterUserRequest) {
        const password_hash = await hash(password, 6)

        const userWithSomeEmail = await this.usersRepository.findByEmail(email)
    
        if(userWithSomeEmail) throw new Error("Esse e-mail já está cadastrado")
    
        await this.usersRepository.create({
            name,
            email,
            gender,
            password: password_hash
        })
    }
}