import { Matchmaking } from "../../domain/entity/MatchMaking";
import { Pokemon } from "../../domain/entity/Pokemon";
import { MatchmakingRepository } from "../../domain/repository/MatchmakingRepository";
import { MatchmakingDocToPendingMatch, PokemonToPokemonDoc } from "../mapper/dataToDomain";
import { Collections, db } from "../mongoDb";
import { MatchmakingDoc } from "../types";

export class MatchmakingRepositoryImpl implements MatchmakingRepository {
    async popMatchmakingOrNull(user: string): Promise<Matchmaking | null> {
        const matchmakingCollection = db.collection<MatchmakingDoc>(Collections.MATCH_MAKING);
        const waitingPlayer = await matchmakingCollection.findOneAndDelete(
            { player: { $ne: user } },
            { sort: { createdAt: 1 } }
        );
        if (!waitingPlayer) return null;
        return MatchmakingDocToPendingMatch(waitingPlayer);
    }
    async createMatchmaking(player: string, pokemons: Pokemon[]): Promise<string> {
        const matchmakingCollection = db.collection<MatchmakingDoc>(Collections.MATCH_MAKING);
        const pokemonsToInsert = pokemons.map(PokemonToPokemonDoc);
        const result = await matchmakingCollection.insertOne({
            player: player,
            pokemons: pokemonsToInsert,
            createdAt: new Date()
        });
        return result.insertedId.toString();
    }

}