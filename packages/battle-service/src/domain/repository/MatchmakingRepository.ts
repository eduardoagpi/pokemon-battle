import { Matchmaking } from "../entity/MatchMaking";
import { Pokemon } from "../entity/Pokemon";

export interface MatchmakingRepository {
    popMatchmakingOrNull(user: string): Promise<Matchmaking | null>
    createMatchmaking(player: string, pokemons: Pokemon[]): Promise<string>
    deleteMatchmaking(matchId: string): Promise<void>
}