import { useNavigate } from "react-router-dom";
import { useGeneralAppContext } from "../../context/GeneralAppContext";
import { useEffect } from "react";

export function useLobbyStatusViewController() {
    const { nickname, selectedPokemons, resetSession } = useGeneralAppContext();
    const navigate = useNavigate()

    const onClickedGoBack = () => {
        resetSession()
    }

    useEffect(() => {
        if (!nickname || !selectedPokemons.length) {
            navigate('/')
            return;
        }
    }, [nickname, selectedPokemons])

    useEffect(() => {
        setTimeout(() => {
            navigate('/battle')
        }, 3000)
    }, [])

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
