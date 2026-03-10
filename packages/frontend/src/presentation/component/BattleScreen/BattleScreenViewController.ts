import { useMemo } from "react";
import { useBattleContext } from "../../context/BattleContext";
import type { PokemonBattlingUi } from "./BattleScreenUI";
import { useGeneralAppContext } from "../../context/GeneralAppContext";

export function useBattleScreenViewController() {

    const generalAppContext = useGeneralAppContext()
    const { battleState, battleMessage, disconnect, send } = useBattleContext()

    const myPokemon: PokemonBattlingUi | undefined = useMemo(() => {
        if (!battleState?.myPokemon) return undefined
        return {
            name: battleState?.myPokemon.name ?? '',
            graphicUrl: battleState?.myPokemon.pokemonGraphicUrl ?? '',
            healthPoints: battleState?.myPokemon.hp ?? 0,
        }
    }, [battleState])

    const opponent: PokemonBattlingUi | undefined = useMemo(() => {
        if (!battleState?.oponent) return undefined
        return {
            name: battleState?.oponent.name ?? '',
            graphicUrl: battleState?.oponent.pokemonGraphicUrl ?? '',
            healthPoints: battleState?.oponent.hp ?? 0,
        }
    }, [battleState])

    const message = useMemo(() => {
        if (battleMessage?.type === 'notify_you_lost') {
            return `Oh no! Has perdido!`
        }
        if (battleMessage?.type === 'notify_you_won') {
            if (battleMessage.reason === 'desertion') return `Tu oponente huyó. Has ganado!!`
            return `Has ganado la batalla!!`
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

    return {
        uiState: {
            myPokemon: myPokemon,
            opponent: opponent,
            message: message,
            isAttackEnabled: battleState?.attackEnabled && !message,
        },
        actions: {
            onClickedMenu,
            onClickedAttack,
        }
    }
}