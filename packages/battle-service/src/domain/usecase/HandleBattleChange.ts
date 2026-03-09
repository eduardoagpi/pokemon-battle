import { Battle } from "../entity/Battle";
import { ServerMessageEmitter } from "../repository/ServerMessageEmitter";

export async function handleBattleChange(
    serverMessageEmitter: ServerMessageEmitter,
    currentUserNickname: string,
    previousState: Battle,
    currentState: Battle
) {

    const currentPlayer = currentState.player1.playerInfo.nickname === currentUserNickname ? currentState.player1 : currentState.player2
    const currentPlayerPreviousState = previousState.player1.playerInfo.nickname === currentUserNickname ? previousState.player1 : previousState.player2
    const opponentPlayer = currentState.player1.playerInfo.nickname === currentUserNickname ? currentState.player2 : currentState.player1
    const opponentPlayerPreviousState = previousState.player1.playerInfo.nickname === currentUserNickname ? previousState.player2 : previousState.player1

    const myFirstAlivePokemon = currentPlayer.pokemonList.find(pokemon => pokemon.healthPoints > 0)
    const oponentFirstAlivePokemon = opponentPlayer.pokemonList.find(pokemon => pokemon.healthPoints > 0)

    const firstAttackPlayer = currentPlayer.pokemonList[0].speedPoints > opponentPlayer.pokemonList[0].speedPoints ? currentPlayer : opponentPlayer
    let attackEnabled: boolean;
    if (currentUserNickname === firstAttackPlayer.playerInfo.nickname) {
        attackEnabled = currentState.turn % 2 === 0
    } else {
        attackEnabled = currentState.turn % 2 === 1
    }


    serverMessageEmitter.emitMessage({
        type: "updateBattleStatus",
        battleState: {
            myPokemon: {
                pokemonId: myFirstAlivePokemon?.index ?? -1,
                pokemonGraphicUrl: myFirstAlivePokemon?.sprite ?? '',
                name: myFirstAlivePokemon?.name ?? '',
                hp: myFirstAlivePokemon?.healthPoints ?? -1
            },
            oponent: {
                pokemonId: oponentFirstAlivePokemon?.index ?? -1,
                pokemonGraphicUrl: oponentFirstAlivePokemon?.sprite ?? '',
                name: oponentFirstAlivePokemon?.name ?? '',
                hp: oponentFirstAlivePokemon?.healthPoints ?? -1
            },
            attackEnabled
        }

    })


    // TODO  Check Last state


    // Verify if your opponent has no more pokemons -> YouWIn message
    if (!oponentFirstAlivePokemon) {
        serverMessageEmitter.emitMessage({
            type: "notify_you_won",
        })
    }

    if (!myFirstAlivePokemon) {
        serverMessageEmitter.emitMessage({
            type: "notify_you_lost",
        })
    }

    const myPreviousFirstAlivePokemon = currentPlayerPreviousState.pokemonList.find(pokemon => pokemon.healthPoints > 0)
    const oponentPreviousFirstAlivePokemon = opponentPlayerPreviousState.pokemonList.find(pokemon => pokemon.healthPoints > 0)

    if (!myPreviousFirstAlivePokemon || !oponentFirstAlivePokemon || !myFirstAlivePokemon || !oponentPreviousFirstAlivePokemon) return

    // Verify if your pokemon defeated contrincant
    if (myPreviousFirstAlivePokemon.index !== myFirstAlivePokemon.index) {
        serverMessageEmitter.emitMessage({
            type: "notify_your_pokemon_defeated",
            pokemonDefeated: {
                pokemonName: myPreviousFirstAlivePokemon.name
            }
        })
    }

    // Verify if your pokemon was defeated
    if (oponentPreviousFirstAlivePokemon.index !== oponentFirstAlivePokemon.index) {
        serverMessageEmitter.emitMessage({
            type: "notify_oponent_pokemon_defeated",
            pokemonDefeated: {
                pokemonName: oponentPreviousFirstAlivePokemon.name
            }
        })
    }

}