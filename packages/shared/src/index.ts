import { z } from 'zod';

export * from './types/BattleTypes.js';
export * from './types/PokemonDtoTypes.js';

export const logMessage = (msg: string) => {
    console.log(`[SHARED]: ${msg}`);
};