import { useState, FormEvent } from 'react';

export function useNickNameSelector(onConfirm: (nickname: string) => void) {
    const [nickname, setNickname] = useState('');

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        if (nickname.trim()) {
            onConfirm(nickname);
        }
    };

    return {
        nickname,
        setNickname,
        handleSubmit
    };
}
