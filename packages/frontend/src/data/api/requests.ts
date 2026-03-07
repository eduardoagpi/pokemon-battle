import { apiClient } from './client';
import type { PokemonListItemResponse, PokemonDetailResponse } from '@poke-albo/shared';

export async function getPokemonList(): Promise<PokemonListItemResponse[]> {
    return apiClient.get<PokemonListItemResponse[]>('/list');
}

export async function getPokemonDetail(id: number): Promise<PokemonDetailResponse> {
    return apiClient.get<PokemonDetailResponse>(`/list/${id}`);
}