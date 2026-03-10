import { Battle, BattlePlayerState } from "../entity/Battle";
import { ServerMessageEmitter } from "../repository/ServerMessageEmitter";

export async function handleBattleChange(
    serverMessageEmitter: ServerMessageEmitter,
    currentUserNickname: string,
    previousState: Battle,
    currentState: Battle
) {
    // Identify current user
    const isP1 = currentState.player1.playerInfo.nickname === currentUserNickname;
    const [me, opponent] = isP1 ? [currentState.player1, currentState.player2] : [currentState.player2, currentState.player1];
    const [prevMe, prevOpponent] = isP1 ? [previousState.player1, previousState.player2] : [previousState.player2, previousState.player1];

    const myId = isP1 ? 'a' : 'b';

    // Helper function to get active pokemon, given a player
    const getActivePokemon = (player: BattlePlayerState) => {
        const p = player.pokemonList.find((p: any) => p.healthPoints > 0);
        return p ? {
            pokemonId: p.index,
            pokemonGraphicUrl: p.sprite,
            name: p.name,
            hp: p.healthPoints
        } : undefined;
    };

    const myPokemon = getActivePokemon(me);
    const opponentPokemon = getActivePokemon(opponent);

    // Is my turn?
    const firstAttackerIsMe = me.pokemonList[0].speedPoints > opponent.pokemonList[0].speedPoints;
    const isMyTurn = firstAttackerIsMe ? (currentState.turn % 2 === 0) : (currentState.turn % 2 === 1);
    const attackEnabled = currentState.status === 'active' && isMyTurn;

    // Loggic to emmit new state, and notification events
    if (currentState.status === 'finished') {
        if (!currentState.result) {
            console.error("battle finished with no status")
            return
        }
        const iWon = myId === currentState.result?.winner;

        serverMessageEmitter.emitMessage({ type: iWon ? "notify_you_won" : "notify_you_lost", reason: currentState.result?.reason });

        // Emit state with te surviving pokemon
        serverMessageEmitter.emitMessage({
            type: "updateBattleStatus",
            battleState: {
                ...(iWon ? { myPokemon } : { oponent: opponentPokemon }),
                attackEnabled
            }
        });
        return;
    }

    // Emit normal state
    serverMessageEmitter.emitMessage({
        type: "updateBattleStatus",
        battleState: { myPokemon, oponent: opponentPokemon, attackEnabled }
    });

    // Detect if any pokemon was defeated, and emmit events if so
    const prevMyPkmn = prevMe.pokemonList.find((p: any) => p.healthPoints > 0);
    const prevOppPkmn = prevOpponent.pokemonList.find((p: any) => p.healthPoints > 0);

    if (prevMyPkmn && myPokemon && prevMyPkmn.index !== myPokemon.pokemonId) {
        serverMessageEmitter.emitMessage({
            type: "notify_your_pokemon_defeated",
            pokemonDefeated: { pokemonName: prevMyPkmn.name }
        });
    }

    if (prevOppPkmn && opponentPokemon && prevOppPkmn.index !== opponentPokemon.pokemonId) {
        serverMessageEmitter.emitMessage({
            type: "notify_oponent_pokemon_defeated",
            pokemonDefeated: { pokemonName: prevOppPkmn.name }
        });
    }
}