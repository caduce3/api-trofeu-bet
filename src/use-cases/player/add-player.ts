import { PlayersRepository } from "@/repositories/players-repository";
import { WalletRepository } from "@/repositories/wallet-repository";
import { Player } from "@prisma/client";
import { PlayerAlreadyExistsError } from "../errors/player-already-exists";
import { ErrorCreatingPlayer } from "../errors/player-error-creating";
import { UsersRepository } from "@/repositories/users-repository";
import { UserAlreadyExistsError } from "../errors/user-already-exists";

interface AddPlayerRequest {
    id_platform: number;
    email: string;
    name: string;
    tell: string;
    date_birth: string;
    ftd_value: number;
    ftd_date: string;
    qtd_deposits: number;
    total_deposit_amount: number;
    total_withdrawals: number;
    qtd_withdrawals: number;
}

interface AddPlayerResponse {
    player: Player;
}

export class AddPlayerUseCase {
    constructor(
        private playersRepository: PlayersRepository
    ) {}

    async execute({
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
    }: AddPlayerRequest): Promise<AddPlayerResponse> {
        
        const player = await this.playersRepository.findByIdPlatform(id_platform);
        if(player) throw new PlayerAlreadyExistsError();

        const verifyEmailPlayer = await this.playersRepository.findByEmail(email);
        if(verifyEmailPlayer) throw new PlayerAlreadyExistsError();

        const parsedDate = new Date(date_birth);
        const parsedFtdDate = new Date(ftd_date);

        const newPlayer = await this.playersRepository.createPlayer({
            id_platform,
            email,
            name,
            tell,
            date_birth: parsedDate,
            date_created: new Date(),
            Wallet: {
                create: {
                    ftd_value,
                    ftd_date: parsedFtdDate,
                    qtd_deposits,
                    total_deposit_amount,
                    total_withdrawals,
                    qtd_withdrawals
                }
            }
        });
        if(!newPlayer) throw new ErrorCreatingPlayer()

        return {
            player: newPlayer
        }
    }
}