import { useEffect, useMemo, useState } from "react";
import { useUpdateApiUrl } from "../../../business/updateApiUrl";
import { apiClient } from "../../../data/api/client";
import { useGetBattleHistory } from "../../../business/getBattleHistory";
import { BattleHistoryItemResponseToBattleHistoryUi } from "./mapper";

export function useSideMenuViewController(isOpen: boolean, onClose: () => void) {
    const { updateApiUrl } = useUpdateApiUrl();
    const [apiUrl, setApiUrl] = useState(apiClient.getBaseUrl());
    const [activeTab, setActiveTab] = useState<'config' | 'history'>('config');

    const [nicknameSearch, setNicknameSearch] = useState('');
    const [nicknameSearchQueryTrigger, setNicknameSearchQueryTrigger] = useState('');

    const { battleHistory, isLoading: isSearching, error: queryError } = useGetBattleHistory(nicknameSearchQueryTrigger, !!nicknameSearchQueryTrigger);


    const onClickedSaveApiUrl = () => {
        updateApiUrl(apiUrl);
    };

    const onClickedTab = (tab: 'config' | 'history') => {
        setActiveTab(tab)
    }

    const onChangedApiUrl = (newValue: string) => {
        setApiUrl(newValue)
    }

    const onNicknameSearchChanged = (newValue: string) => {
        setNicknameSearch(newValue)
    }

    const onClickedSearchHistoryButton = async () => {
        if (!nicknameSearch.trim()) return;
        setNicknameSearchQueryTrigger(nicknameSearch.trim());
    }

    const onClicekdClearHistoryButton = () => {
        setNicknameSearch('');
        setNicknameSearchQueryTrigger('');
    }

    const historyResults = useMemo(() => {
        if (!battleHistory) return [];
        return battleHistory.map((item) => {
            return BattleHistoryItemResponseToBattleHistoryUi(nicknameSearchQueryTrigger, item)
        })
    }, [battleHistory])

    const searchError = queryError ? "Error al buscar el historial. Verifica la conexión." : (battleHistory?.length === 0 && nicknameSearchQueryTrigger ? "No se encontró historial para este usuario." : null);


    useEffect(() => {
        if (isOpen) setApiUrl(apiClient.getBaseUrl())
    }, [isOpen])

    return {
        uiState: {
            activeTab,
            apiUrl,
            nicknameSearch,
            historyResults,
            isSearching,
            searchError,
        },
        actions: {
            onClickedTab,
            onChangedApiUrl,
            onClickedSaveApiUrl,
            onNicknameSearchChanged,
            onClickedSearchHistoryButton,
            onClicekdClearHistoryButton,
            onClose,
        }
    }
}