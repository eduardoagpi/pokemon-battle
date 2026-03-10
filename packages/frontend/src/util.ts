export const NUM_POKEMONS = 3;

export const ONE_SECOND_MS = 1000

// Funcion para obtener n elementos unicos aleatorios de un array
// Los elementos no se repiten
export function getUniqueItems<T>(array: T[], count: number): T[] {
    if (array.length < count) {
        throw new Error(`El array tiene ${array.length} elementos, pero pediste ${count}.`);
    }

    const selectedIndices = new Set<number>();
    const result: T[] = [];

    while (selectedIndices.size < count) {
        const randomIndex = Math.floor(Math.random() * array.length);

        if (!selectedIndices.has(randomIndex)) {
            selectedIndices.add(randomIndex);
            result.push(array[randomIndex]);
        }
    }

    return result;
}