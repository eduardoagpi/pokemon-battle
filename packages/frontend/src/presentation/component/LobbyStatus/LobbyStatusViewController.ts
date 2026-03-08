import { useNavigate } from "react-router-dom";
import { useGeneralAppContext } from "../../context/GeneralAppContext";
import { useEffect } from "react";
import { useBattleContext } from "../../context/BattleContext";

export function useLobbyStatusViewController() {
    const { nickname, selectedPokemons, resetSession } = useGeneralAppContext();
    const battleContext = useBattleContext()
    const navigate = useNavigate()

    const onClickedGoBack = () => {
        resetSession()
        battleContext.disconnect();
    }

    useEffect(() => {
        if (!nickname || !selectedPokemons.length) {
            navigate('/')
            return;
        }
    }, [nickname, selectedPokemons])

    useEffect(() => {
        if (!nickname.trim()) return;
        battleContext.connect(nickname)
    }, [nickname])

    return {
        uiState: {
            nickname: nickname,
            assignedPokemons: selectedPokemons,
        },
        actions: {
            onClickedGoBack
        }
    };
}
