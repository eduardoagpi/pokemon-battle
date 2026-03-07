import { useState, useEffect } from 'react';
import { useGetRandomPokemons } from '../../../business/getRandomPokemons';
import { useNavigate } from 'react-router-dom';
import { useGeneralAppContext } from '../../context/GeneralAppContext';

export function useNickNameSelectorViewController(
) {
    const [nickname, setNickname] = useState('');
    const [enabled, setEnabled] = useState(false);
    const navigate = useNavigate();
    const {
        setNickname: setNicknameContext,
        setSelectedPokemons,
        nickname: contextNickName,
        selectedPokemons: contextSelectedPokemons
    } = useGeneralAppContext()

    const { pokemons } = useGetRandomPokemons(enabled);

    const onClickedConfirm = () => {
        if (!nickname.trim()) return;
        setEnabled(true);
    };

    useEffect(() => {
        if (!enabled || pokemons.length === 0) return;
        setNicknameContext(nickname);
        setSelectedPokemons(pokemons);
    }, [pokemons, enabled, nickname]);

    useEffect(() => {
        if (!contextNickName.trim() || !contextSelectedPokemons.length) return;
        console.log("will nabigate")
        navigate('/lobby')
    }, [contextNickName, contextSelectedPokemons])


    return {
        uiState: {
            nickname,
            buttonDisabled: !nickname.trim(),
        },
        actions: {
            setNickname,
            onClickedConfirm
        }
    };
}
