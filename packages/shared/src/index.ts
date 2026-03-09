import { z, ZodSchema } from 'zod';

export * from './types/BattleTypes.js';
export * from './types/PokemonDtoTypes.js';

export const logMessage = (msg: string) => {
    console.log(`[SHARED]: ${msg}`);
};

export function parseJsonSerializedOrNull<T>(schema: ZodSchema<T>, input: string): T | null {
    try {
        const object = JSON.parse(input)
        return parseOrNull(schema, object);
    } catch (error) {
        console.error("Error al parsear JSON:", error);
        return null;
    }
}

export function parseOrNull<T>(schema: ZodSchema<T>, input: unknown): T | null {
    const result = schema.safeParse(input);

    if (!result.success) {
        // Esto imprimirá una tabla clara en tu consola del navegador
        console.group("❌ Error de Validación Zod");
        console.error("Input recibido:", input);
        console.error("Errores específicos:");

        // El método .format() organiza los errores por campo
        console.table(result.error.flatten().fieldErrors);

        // También puedes ver el error completo si necesitas más detalle
        // console.log(result.error); 

        console.groupEnd();
        return null;
    }

    return result.data;
}