import { gql } from "apollo-server";

export const typeDefs = gql`
  enum PokemonType {
    NORMAL
    FIRE
    WATER
    ELECTRIC
    GRASS
    ICE
    FIGHTING
    POISON
    GROUND
    FLYING
    PSYCHIC
    BUG
    ROCK
    GHOST
    DRAGON
  }

  type Pokemon {
    _id: ID!
    name: String!
    description: String!
    height: Float!
    weight: Float!
    types: [PokemonType!]!
  }

  type OwnedPokemon {
    _id: ID!
    attack: Int!
    defense: Int!
    speed: Int!
    special: Int!
    level: Int!
    pokemon: Pokemon!
  }

  type Trainer {
    name: String!
    pokemons: [OwnedPokemon!]!
  }

  type Query {
    me: Trainer
    pokemons(page: Int, size: Int): [Pokemon!]!
    pokemon(id: ID!): Pokemon
  }

  type Mutation {
    startJourney(name: String!, password: String!): String!
    login(name: String!, password: String!): String!
    createPokemon(
      name: String!
      description: String!
      height: Float!
      weight: Float!
      types: [PokemonType!]!
    ): Pokemon!
    catchPokemon(pokemonId: ID!): OwnedPokemon!
    freePokemon(ownedPokemonId: ID!): Trainer!
  }
`;