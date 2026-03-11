import { useNavigate } from "react-router-dom";
import { useGeneralAppContext } from "../../context/GeneralAppContext";
import { useEffect, useState } from "react";
import { useBattleContext } from "../../context/BattleContext";
import { useSnackbar } from "../../hooks/useSnackbar";

export function useLobbyStatusViewController() {
    const { nickname, selectedPokemons, resetSession } = useGeneralAppContext();
    const battleContext = useBattleContext()
    const navigate = useNavigate()
    const { showError } = useSnackbar()
    const [imReady, setImReady] = useState(false);

    const onClickedGoBack = () => {
        resetSession()
        battleContext.disconnect(true);
    }

    useEffect(() => {
        if (!nickname.trim() || !selectedPokemons.length) {
            navigate('/')
            return;
        }
    }, [nickname, selectedPokemons])

    const onClickedImReady = () => {
        if (!nickname.trim()) {
            showError("Nickname invalido")
            return;
        }
        if (!selectedPokemons.length) {
            showError("Lista de pokemones invalida")
            return;
        }
        setImReady(true)
        battleContext.connect(nickname, selectedPokemons)
    }

    return {
        uiState: {
            nickname: nickname,
            assignedPokemons: selectedPokemons,
            imReady
        },
        actions: {
            onClickedGoBack,
            onClickedImReady,
        }
    };
}
