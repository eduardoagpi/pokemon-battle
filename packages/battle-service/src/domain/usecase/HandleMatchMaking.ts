import { ExtWebSocket } from "../../presentation/webSocket";
import { subscribeToBattle } from "../usecase/SubscribeToBattle";
import { NewConnectionSuccess } from "./HandleNewConnection";
import BattleRepository from "../../data/repository/BattleRepository";
import { BattleReactiveRepository } from "../repository/BattleReactiveRepository";
import { MongoBattleReactiveRepository } from "../../data/repository/BattleReactiveRepositoryImpl";
import { handleBattleChange } from "./HandleBattleChange";

export async function handleMatchMaking(
    socket: ExtWebSocket,
    newConnection: NewConnectionSuccess,
    onBattleCreated: (battleId: string) => void,
) {
    const reactiveRepository: BattleReactiveRepository = new MongoBattleReactiveRepository(newConnection.matchId);
    reactiveRepository.subscribeToBattleCreation(() => {
        onBattleCreated(newConnection.matchId);
    });
    reactiveRepository.subscribeToBattle((previousBattleState, currentBattleState) => {
        handleBattleChange(previousBattleState, currentBattleState);
    });

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