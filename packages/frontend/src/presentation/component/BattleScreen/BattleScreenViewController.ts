import { useMemo, useState } from "react";
import { useBattleContext } from "../../context/BattleContext";
import type { PokemonBattlingUi } from "./BattleScreenUI";
import { useGeneralAppContext } from "../../context/GeneralAppContext";

export function useBattleScreenViewController() {

    const generalAppContext = useGeneralAppContext()
    const { battleState, battleMessage, disconnect, send } = useBattleContext()
    const [battleFinishedMessage, setBattleFinishedMessage] = useState('')

    const myPokemon: PokemonBattlingUi | undefined = useMemo(() => {
        if (!battleState?.myPokemon) return undefined
        return {
            name: battleState.myPokemon.name,
            graphicUrl: battleState.myPokemon.pokemonGraphicUrl,
            healthPoints: battleState.myPokemon.hp,
            remainingPokemons: battleState.myPokemon.remainingPokemonCount
        }
    }, [battleState])

    const opponent: PokemonBattlingUi | undefined = useMemo(() => {
        if (!battleState?.oponent) return undefined
        return {
            name: battleState.oponent.name,
            graphicUrl: battleState.oponent.pokemonGraphicUrl,
            healthPoints: battleState.oponent.hp,
            remainingPokemons: battleState.oponent.remainingPokemonCount
        }
    }, [battleState])

    const temporalMessage = useMemo(() => {
        if (battleMessage?.type === 'notify_you_lost') {
            setBattleFinishedMessage('Oh no! Has perdido!')
            return null;
        }
        if (battleMessage?.type === 'notify_you_won') {
            battleMessage.reason === 'desertion' ? setBattleFinishedMessage('Tu oponente huyó. Has ganado!!') : setBattleFinishedMessage('Has ganado la batalla!!')
            return null;
        }
        if (battleMessage?.type === 'notify_oponent_pokemon_defeated') {
            return `Excelente, ${battleMessage.pokemonDefeated.pokemonName} ha sido derrotado`
        }
        if (battleMessage?.type === "notify_your_pokemon_defeated") {
            return `Oh no! tu pokemon fue derrotado`
        }
        return null
    }, [battleMessage])

    const onClickedMenu = () => {
        generalAppContext.resetSession();
        disconnect(true);
    }

    const onClickedAttack = () => {
        send({ type: "attack" })
    }

    const message = temporalMessage || battleFinishedMessage

    return {
        uiState: {
            myPokemon: myPokemon,
            opponent: opponent,
            message: message,
            isAttackEnabled: battleState?.attackEnabled && !temporalMessage,
        },
        actions: {
            onClickedMenu,
            onClickedAttack,
        }
    }
}