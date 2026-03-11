import z from "zod"

export const BattleStateSchema = z.object({
    oponent: z.object({
        pokemonId: z.number(),
        pokemonGraphicUrl: z.string(),
        name: z.string(),
        hp: z.number(),
    }).optional(),
    myPokemon: z.object({
        pokemonId: z.number(),
        pokemonGraphicUrl: z.string(),
        name: z.string(),
        hp: z.number(),
    }).optional(),
    attackEnabled: z.boolean()
})
export type BattleState = z.infer<typeof BattleStateSchema>

export const BattleWSServerMessageSchema = z.discriminatedUnion("type", [
    z.object({
        type: z.literal("start_battle"),
    }),
    z.object({
        type: z.literal("updateBattleStatus"),
        battleState: BattleStateSchema,
    }),
    z.object({
        type: z.literal("notify_your_pokemon_defeated"),
        pokemonDefeated: z.object({
            pokemonName: z.string()
        })
    }),
    z.object({
        type: z.literal("notify_oponent_pokemon_defeated"),
        pokemonDefeated: z.object({
            pokemonName: z.string()
        })
    }),
    z.object({
        type: z.literal("notify_you_won"),
        reason: z.enum(["combat", "desertion"])
    }),
    z.object({
        type: z.literal("notify_you_lost"),
    }),
])

export type BattleWSServerMessage = z.infer<typeof BattleWSServerMessageSchema>

export const BattleWSClientMessageSchema = z.discriminatedUnion("type", [
    z.object({
        type: z.literal("attack")
    }),
])

export type BattleWSClientMessage = z.infer<typeof BattleWSClientMessageSchema>

export const BattleHistoryItemSchema = z.object({
    opponentNickname: z.string(),
    result: z.enum(["win", "loss"]),
    date: z.string(),
    reason: z.enum(["combat", "desertion"]).optional()
});

export type BattleHistoryItemResponse = z.infer<typeof BattleHistoryItemSchema>;

