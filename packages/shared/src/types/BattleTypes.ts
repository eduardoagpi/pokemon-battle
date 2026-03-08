import z from "zod"

export const BattleWSServerMessageSchema = z.discriminatedUnion("battleWSMessage", [
    z.object({
        type: z.literal("start_battle")
    }),
    z.object({
        type: z.literal("updateBattleStatus"),
        oponent: z.object({
            pokemonId: z.number(),
            name: z.string(), // delete?
            hp: z.number(),
        }),
        myPokemon: z.object({
            pokemonId: z.number(),
            name: z.string(), // delete?
            hp: z.number(),
        })
    }),
    z.object({
        type: z.literal("notify_pokemon_defeated"),
        pokemonDefeated: z.object({
            pokemonName: z.string()
        })
    }),
    z.object({
        type: z.literal("notify_battle_finished"),
        winnerNickname: z.string()
    })
])

export type BattleWSServerMessage = z.infer<typeof BattleWSServerMessageSchema>

export const BattleWSClientMessageSchema = z.discriminatedUnion("clientMessage", [
    z.object({
        type: z.literal("atack")
    }),
])

export type BattleWSClientMessage = z.infer<typeof BattleWSClientMessageSchema>
