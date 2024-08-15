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
    tell: string | null;
    date_birth: string;
    ftd_value: number;
    ftd_date: string | null;
    qtd_deposits: number;
    total_deposit_amount: number;
    total_withdrawals: number;
    qtd_withdrawals: number;
    platform_regitration_date: string | null;
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
        qtd_withdrawals,
        platform_regitration_date
    }: AddPlayerRequest): Promise<AddPlayerResponse> {
        
        const player = await this.playersRepository.findByIdPlatform(id_platform);
        if(player) throw new PlayerAlreadyExistsError();

        const verifyEmailPlayer = await this.playersRepository.findByEmail(email);
        if(verifyEmailPlayer) throw new PlayerAlreadyExistsError();

        //se alguns dos campos que tem a possibilidade de vir = null for = null, transforme para string vazia
        if(tell === null) tell = 'dado não informado';
        if(ftd_date === null) ftd_date = 'dado não informado';
        if(platform_regitration_date === null) platform_regitration_date = 'dado não informado';

        const parsedDate = new Date(date_birth);
        const parsedFtdDate = new Date(ftd_date);
        const parsedPlataformRegistrationDate = new Date(platform_regitration_date)


        const newPlayer = await this.playersRepository.createPlayer({
            id_platform,
            email,
            name,
            tell,
            date_birth: parsedDate,
            date_created: new Date(),
            platform_regitration_date: parsedPlataformRegistrationDate,
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