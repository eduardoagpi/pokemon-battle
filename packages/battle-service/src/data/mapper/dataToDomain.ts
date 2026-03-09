import { PokemonDetailResponse } from "@poke-albo/shared";
import { Battle, Pokemon } from "../../domain/entity/Battle";
import { Matchmaking } from "../../domain/entity/MatchMaking";
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
        sprite: pokemonDoc.sprite,
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
        sprite: input.sprite,
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
        sprite: pokemon.sprite,
        healthPoints: pokemon.healthPoints,
        attackPoints: pokemon.attackPoints,
        defensePoints: pokemon.defensePoints,
        speedPoints: pokemon.speedPoints
    };
}

export function BattleDocToBattle(battleDoc: BattleDoc): Battle {
    return {
        id: battleDoc._id?.toString() ?? '',
        matchmakingId: battleDoc.matchmakingId,
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