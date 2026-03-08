import { z } from 'zod';

export const logMessage = (msg: string) => {
    console.log(`[SHARED]: ${msg}`);
};