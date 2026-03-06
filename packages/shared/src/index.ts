import { z } from 'zod';

export interface UserDTO {
    id: string;
    name: string;
    email: string;
}

export const PokemonListItemResponseSchema = z.object({
    id: z.number(),
    name: z.string(),
});
export type PokemonListItemResponse = z.infer<typeof PokemonListItemResponseSchema>;
export const PokemonListResponseSchema = z.array(PokemonListItemResponseSchema);

export const PokemonDetailResponseSchema = PokemonListItemResponseSchema.extend({
    type: z.array(z.string()),
    hp: z.number(),
    attack: z.number(),
    defense: z.number(),
    speed: z.number(),
    sprite: z.string(),
});
export type PokemonDetailResponse = z.infer<typeof PokemonDetailResponseSchema>;

export const logMessage = (msg: string) => {
    console.log(`[SHARED]: ${msg}`);
};
