import { useQuery } from "@tanstack/react-query";
import { getBattleHistory } from "../../data/api/requests";
import { CACHE_KEYS } from "../../data/api/cacheKeys";
import { useEffect } from "react";
import { useSnackbar } from "../../presentation/hooks/useSnackbar";

export function useGetBattleHistory(nickname: string, enabled?: boolean) {
    const { showError } = useSnackbar();
    const { data, isLoading, error } = useQuery({
        queryKey: [CACHE_KEYS.BATTLE_HISTORY, nickname],
        queryFn: () => getBattleHistory(nickname),
        enabled: (enabled ?? true) && !!nickname,
    });

    useEffect(() => {
        if (error) {
            showError("No se pudo obtener el historial de batallas");
        }
    }, [error, showError]);

    return {
        battleHistory: data,
        isLoading,
        error,
    };
}
