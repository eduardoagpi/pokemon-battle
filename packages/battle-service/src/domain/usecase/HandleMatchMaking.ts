import { ExtWebSocket } from "../../presentation/webSocket";
import { subscribeToBattle } from "../usecase/SubscribeToBattle";
import { NewConnectionSuccess } from "./HandleNewConnection";
import BattleRepository from "../../data/repository/BattleRepository";

export async function handleMatchMaking(
    socket: ExtWebSocket,
    newConnection: NewConnectionSuccess,
    onBattleCreated: (battleId: string) => void,
) {
    subscribeToBattle(socket, newConnection.matchId, onBattleCreated);
    if (newConnection.type === 'opponentFound') {
        const battleId = await BattleRepository.createBattle({
            matchmakingId: newConnection.matchId,
            playerA: newConnection.userA,
            playerB: newConnection.userB,
            pokemonsA: newConnection.userAPokemons,
            pokemonsB: newConnection.userBPokemons
        })
        onBattleCreated(battleId)
    }
}