import { Matchmaking, Pokemon } from "../../domain/entity/entity";
import { MatchmakingDocToPendingMatch, PokemonToPokemonDoc } from "../mapper/dataToDomain";
import { Collections, db } from "../mongoDb";
import { BattleDoc, MatchmakingDoc } from "../types";

const BattleRepository = {
    popMatchmakingOrNull: async (user: string): Promise<Matchmaking | null> => {
        const matchmakingCollection = db.collection<MatchmakingDoc>(Collections.MATCH_MAKING);
        const waitingPlayer = await matchmakingCollection.findOneAndDelete(
            { player: { $ne: user } },
            { sort: { createdAt: 1 } }
        );
        if (!waitingPlayer) return null;
        return MatchmakingDocToPendingMatch(waitingPlayer);
    },
    createMatchmaking: async (player: string, pokemons: Pokemon[]): Promise<string> => {
        const matchmakingCollection = db.collection<MatchmakingDoc>(Collections.MATCH_MAKING);
        const pokemonsToInsert = pokemons.map(PokemonToPokemonDoc);
        const result = await matchmakingCollection.insertOne({
            player: player,
            pokemons: pokemonsToInsert,
            createdAt: new Date()
        });
        return result.insertedId.toString();
    },
    createBattle: async (args: { matchmakingId: string, playerA: string, playerB: string, pokemonsA: Pokemon[], pokemonsB: Pokemon[] }): Promise<string> => {
        const battleCollection = db.collection<BattleDoc>(Collections.BATTLE)
        const battleData: BattleDoc = {
            matchmakingId: args.matchmakingId,
            playerA: {
                nickname: args.playerA,
                pokemons: args.pokemonsA
            },
            playerB: {
                nickname: args.playerB,
                pokemons: args.pokemonsB
            },
            status: "active",
            createdAt: new Date()
        }
        const result = await battleCollection.insertOne(battleData);
        return result.insertedId.toString();
    },

}

export default BattleRepository;