export type Pokemon = {
    index: number;
    name: string;
    type: string[]; /// remove?
    sprite: string;
    healthPoints: number;
    attackPoints: number;
    defensePoints: number;
    speedPoints: number;
}