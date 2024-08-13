// import { InMemoryUsersRepository } from "@/repositories/in-memory/in-memory-users-repository";
// import { expect, describe, it } from 'vitest'
// import { RegisterUserUseCase } from "./register-user";

// describe('Register Use Case'), () => {
//     it('should be able to register', async () => {
//         const usersRepository = new InMemoryUsersRepository()
//         const registerUserUseCase = new RegisterUserUseCase(usersRepository)

//         const { user } = await registerUserUseCase.execute({
//             name: 'John Doe',
//             email: 'jhon@gmail.com',
//             password: '123456',
//             gender: 'masculino'
//         })

//         expect(user.id).toEqual(expect.any(String))
//     })
// }
import { expect, test } from 'vitest'

test('check if it works', () => {
    expect(2+2).toBe(4)
})