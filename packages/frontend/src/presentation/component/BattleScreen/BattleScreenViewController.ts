import { useMemo } from "react";
import { useBattleContext } from "../../context/BattleContext";
import type { PokemonBattlingUi } from "./BattleScreenUI";
import { useGeneralAppContext } from "../../context/GeneralAppContext";

export function useBattleScreenViewController() {

    const generalAppContext = useGeneralAppContext()
    const battleStateContext = useBattleContext()

    const myPokemon: PokemonBattlingUi | undefined = useMemo(() => {
        if (!battleStateContext.battleState?.myPokemon) return undefined
        return {
            name: battleStateContext.battleState?.myPokemon.name ?? '',
            graphicUrl: battleStateContext.battleState?.myPokemon.pokemonGraphicUrl ?? '',
            healthPoints: battleStateContext.battleState?.myPokemon.hp ?? 0,
        }
    }, [battleStateContext.battleState])

    const opponent: PokemonBattlingUi | undefined = useMemo(() => {
        if (!battleStateContext.battleState?.oponent) return undefined
        return {
            name: battleStateContext.battleState?.oponent.name ?? '',
            graphicUrl: battleStateContext.battleState?.oponent.pokemonGraphicUrl ?? '',
            healthPoints: battleStateContext.battleState?.oponent.hp ?? 0,
        }
    }, [battleStateContext.battleState])

    const onClickedMenu = () => {
        generalAppContext.resetSession();
        battleStateContext.disconnect();
    }

    const onClickedAttack = () => {
        battleStateContext.send({ type: "attack" })
    }

    return {
        uiState: {
            myPokemon: myPokemon,
            opponent: opponent,
            message: "",
            isAttackEnabled: battleStateContext.battleState?.attackEnabled,
        },
        actions: {
            onClickedMenu,
            onClickedAttack,
        }
    }
}