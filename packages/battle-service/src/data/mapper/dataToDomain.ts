import { PokemonDetailResponse } from "@poke-albo/shared";
import { Battle, Matchmaking, Pokemon } from "../../domain/entity/entity";
import { BattleDoc, MatchmakingDoc, PokemonDoc } from "../types";

export function MatchmakingDocToPendingMatch(matchmakingDoc: MatchmakingDoc): Matchmaking {
    return {
        id: matchmakingDoc._id?.toString() ?? '',
        player: {
            nickname: matchmakingDoc.player
        },
        pokemonList: matchmakingDoc.pokemons.map(PokemonDocToPokemon),
        createdAt: matchmakingDoc.createdAt
    }
}

export function PokemonDocToPokemon(pokemonDoc: PokemonDoc): Pokemon {
    return {
        index: pokemonDoc.index,
        name: pokemonDoc.name,
        type: pokemonDoc.type,
        healthPoints: pokemonDoc.healthPoints,
        attackPoints: pokemonDoc.attackPoints,
        defensePoints: pokemonDoc.defensePoints,
        speedPoints: pokemonDoc.speedPoints
    };
}

export function PokemonDetailResponseToPokemon(input: PokemonDetailResponse): Pokemon {
    return {
        index: input.id,
        name: input.name,
        type: [],
        healthPoints: input.hp,
        attackPoints: input.attack,
        defensePoints: input.defense,
        speedPoints: input.speed,
    }
}

export function PokemonToPokemonDoc(pokemon: Pokemon): PokemonDoc {
    return {
        index: pokemon.index,
        name: pokemon.name,
        type: pokemon.type,
        healthPoints: pokemon.healthPoints,
        attackPoints: pokemon.attackPoints,
        defensePoints: pokemon.defensePoints,
        speedPoints: pokemon.speedPoints
    };
}

export function BattleDocToBattle(battleDoc: BattleDoc): Battle {
    return {
        id: battleDoc._id?.toString() ?? '',
        player1: {
            playerInfo: {
                nickname: battleDoc.playerA.nickname
            },
            pokemonList: battleDoc.playerA.pokemons.map(PokemonDocToPokemon)
        },
        player2: {
            playerInfo: {
                nickname: battleDoc.playerB.nickname
            },
            pokemonList: battleDoc.playerB.pokemons.map(PokemonDocToPokemon)
        },
        turn: battleDoc.turn,
        created: battleDoc.createdAt
    };
}