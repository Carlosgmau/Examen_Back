import { ObjectId } from "mongodb";
import { getDB } from "../db/mongo";

export type PokemonType = "NORMAL" | "FIRE" | "WATER" | "ELECTRIC" | "GRASS" | "ICE" | "FIGHTING" | "POISON" | "GROUND" | "FLYING" | "PSYCHIC" | "BUG" | "ROCK" | "GHOST" | "DRAGON" ;

export type PokemonDB = {
  _id: ObjectId;
  name: string;
  description: string;
  height: number;
  weight: number;
  types: PokemonType[];
};

const COLLECTION = "pokemons";

// pokemoms.ts tiene  crear Pokemon, Hacer la lista y encontrar un pokemon por su id

export const createPokemon = async (input: Omit<PokemonDB, "_id">) => {
  const res = await getDB().collection(COLLECTION).insertOne(input as any);
  return { ...input, _id: res.insertedId };
};




export const listPokemons = async (page = 1, size = 10) => {
  return getDB()
    .collection<PokemonDB>(COLLECTION)
    .find()
    .skip((page - 1) * size)
    .limit(size)
    .toArray();
};



export const findPokemonById = async (id: string) => {
  return getDB()
    .collection<PokemonDB>(COLLECTION)
    .findOne({ _id: new ObjectId(id) });
};


