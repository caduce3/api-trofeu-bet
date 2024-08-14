import { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";
import { makeAddPlayerUseCase } from "@/use-cases/factories/player/make-add-player-use-case";
import { PlayerAlreadyExistsError } from "@/use-cases/errors/player-already-exists";
import { ErrorCreatingPlayer } from "@/use-cases/errors/player-error-creating";
import { UserAlreadyExistsError } from "@/use-cases/errors/user-already-exists";

export async function addPlayer(request: FastifyRequest, reply: FastifyReply) {
    const addPlayerBodySchema = z.object({
        id_platform: z.number(),
        email: z.string(),
        name: z.string(),
        tell: z.string(),
        date_birth: z.string(),
        ftd_value: z.number(),
        ftd_date: z.string(),
        qtd_deposits: z.number(),
        total_deposit_amount: z.number(),
        total_withdrawals: z.number(),
        qtd_withdrawals: z.number()
    })

    const { 
        id_platform, 
        email, 
        name, 
        tell, 
        date_birth, 
        ftd_value, 
        ftd_date, 
        qtd_deposits, 
        total_deposit_amount, 
        total_withdrawals, 
        qtd_withdrawals 
    } = addPlayerBodySchema.parse(request.body)

    try {
        const addPlayerUseCase = makeAddPlayerUseCase()

        await addPlayerUseCase.execute({
            id_platform,
            email,
            name,
            tell,
            date_birth,
            ftd_value,
            ftd_date,
            qtd_deposits,
            total_deposit_amount,
            total_withdrawals,
            qtd_withdrawals
        })

    } catch (error) {
        if(
            error instanceof PlayerAlreadyExistsError ||
            error instanceof ErrorCreatingPlayer)
        {
            return reply.status(409).send({message: error.message})
        }

        throw error
    }

    return reply.status(201).send({message: "Usuário autenticado com sucesso!"})
}