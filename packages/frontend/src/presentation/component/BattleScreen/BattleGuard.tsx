import type { JSX } from "react";
import { Navigate } from "react-router-dom";
import { useGeneralAppContext } from "../../context/GeneralAppContext";

export const BattleGuard = ({ children }: { children: JSX.Element }) => {
    const { selectedPokemons } = useGeneralAppContext();

    if (!selectedPokemons || selectedPokemons.length < 3) {
        return <Navigate to="/" replace />;
    }

    return children;
};