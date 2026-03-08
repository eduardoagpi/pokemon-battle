import { NewConnectionSuccess } from "./HandleNewConnection";
import BattleRepository from "../../data/repository/BattleRepositoryImpl";
import { Battle } from "../entity/Battle";

export async function handleMatchMaking(
    newConnection: NewConnectionSuccess,
    battleRepository: BattleRepository,
) {
    if (newConnection.type === 'opponentFound') {
        const battle: Battle = {
            matchmakingId: newConnection.matchId,
            player1: {
                playerInfo: {
                    nickname: newConnection.userA
                },
                pokemonList: newConnection.userAPokemons
            },
            player2: {
                playerInfo: {
                    nickname: newConnection.userB
                },
                pokemonList: newConnection.userBPokemons
            },
            turn: 0,
            created: new Date()
        }
        await battleRepository.createBattle(battle)
    }
}