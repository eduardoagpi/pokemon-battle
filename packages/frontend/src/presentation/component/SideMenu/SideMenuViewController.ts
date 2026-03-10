import { useEffect, useState } from "react";
import { useUpdateApiUrl } from "../../../business/updateApiUrl";
import { apiClient } from "../../../data/api/client";

export function useSideMenuViewController(isOpen: boolean, onClose: () => void) {
    const { updateApiUrl } = useUpdateApiUrl();
    const [apiUrl, setApiUrl] = useState(apiClient.getBaseUrl());
    const [activeTab, setActiveTab] = useState<'config' | 'history'>('config');


    const onClickedSaveApiUrl = () => {
        updateApiUrl(apiUrl);
    };

    const onClickedTab = (tab: 'config' | 'history') => {
        setActiveTab(tab)
    }

    const onChangedApiUrl = (newValue: string) => {
        setApiUrl(newValue)
    }

    useEffect(() => {
        if (isOpen) setApiUrl(apiClient.getBaseUrl())
    }, [isOpen])

    return {
        uiState: {
            activeTab,
            apiUrl,
        },
        actions: {
            onClickedTab,
            onChangedApiUrl,
            onClickedSaveApiUrl,
            onClose,
        }
    }
}