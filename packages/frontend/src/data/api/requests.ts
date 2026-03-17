import axios from 'axios';
import { apiClient } from './client';
import type { PokemonListItemResponse, PokemonDetailResponse, BattleHistoryItemResponse } from '@poke-albo/shared';

export async function getPokemonList(): Promise<PokemonListItemResponse[]> {
    return apiClient.get<PokemonListItemResponse[]>('/list');
}

export async function getPokemonDetail(id: number): Promise<PokemonDetailResponse> {
    return apiClient.get<PokemonDetailResponse>(`/list/${id}`);
}

export async function getBattleHistory(nickname: string): Promise<BattleHistoryItemResponse[]> {
    const battleServerUrl = import.meta.env.VITE_BATTLE_SERVER;
    const httpUrl = battleServerUrl.replace('ws://', 'http://').replace('wss://', 'https://');

    const response = await axios.get<BattleHistoryItemResponse[]>(`${httpUrl}/history/${nickname}`);
    return response.data;
}