import { useMemo } from "react";
import { useGeneralAppContext } from "../../context/GeneralAppContext";
import type { PokemonBattlingUi } from "./BattleScreenUI";

export function useBattleScreenViewController() {
    const { selectedPokemons } = useGeneralAppContext()
    const myPokemon: PokemonBattlingUi = useMemo(() => {
        return {
            name: selectedPokemons[0].name,
            graphicUrl: selectedPokemons[0].sprite,
            healthPoints: selectedPokemons[0].hp,
        }
    }, [selectedPokemons])

    const opponent: PokemonBattlingUi = useMemo(() => {
        return {
            name: selectedPokemons[1].name,
            graphicUrl: selectedPokemons[1].sprite,
            healthPoints: selectedPokemons[1].hp,
        }
    }, [selectedPokemons])

    const onClickedMenu = () => {
        window.history.back()
    }

    const onClickedDPad = (action: 'left' | 'up' | 'right' | 'down') => {
        // TODO
    }

    const onClickedAttack = () => {
        // TODO
    }

    return {
        uiState: {
            myPokemon: myPokemon,
            opponent: opponent,
            message: "",
            isAttackEnabled: true,
        },
        actions: {
            onClickedMenu,
            onClickedDPad,
            onClickedAttack,
        }
    }
}