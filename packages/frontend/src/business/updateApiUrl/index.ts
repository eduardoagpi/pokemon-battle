import { useQueryClient } from "@tanstack/react-query";
import { apiClient } from "../../data/api/client";
import { useSnackbar } from "../../presentation/hooks/useSnackbar";

export function useUpdateApiUrl() {
    const queryClient = useQueryClient()
    const { showSuccess } = useSnackbar()

    const updateApiUrl = (newApiUrl: string) => {
        apiClient.setBaseUrl(newApiUrl);
        showSuccess(`API Url actualizada. Nueva url: ${newApiUrl}`)
        queryClient.clear()
    }

    return { updateApiUrl }
}