import { ObjectId } from "mongodb";
import { getDB } from "../db/mongo";

export type OwnedPokemonDB = {
  _id: ObjectId;
  pokemon: ObjectId;
  trainer: ObjectId;
  attack: number;
  defense: number;
  speed: number;
  special: number;
  level: number;
};


const COLLECTION = "ownedPokemons";

// Para generaar el número aleatorio y que se elijan las estadísticas

const rand = () => Math.floor(Math.random() * 100) + 1;


// Crear un pk que pertenezca a un entrenador, buscarlo mediante el entrenador  o por su id y luego que te permita borrarlo

export const createOwnedPokemon = async (
  pokemonId: ObjectId,
  trainerId: ObjectId
) => {
  const owned: Omit<OwnedPokemonDB, "_id"> = {
    pokemon: pokemonId,
    trainer: trainerId,
    attack: rand(),
    defense: rand(),
    speed: rand(),
    special: rand(),
    level: 1
  };


  const res = await getDB().collection(COLLECTION).insertOne(owned as any);
  return { ...owned, _id: res.insertedId };
};



export const findOwnedByTrainer = async (trainerId: ObjectId) => {
  return getDB()
    .collection<OwnedPokemonDB>(COLLECTION)
    .find({ trainer: trainerId })
    .toArray();
};




export const findOwnedById = async (id: string) => {
  return getDB()
    .collection<OwnedPokemonDB>(COLLECTION)
    .findOne({ _id: new ObjectId(id) });
};




export const deleteOwnedPokemon = async (id: ObjectId) => {
  await getDB().collection(COLLECTION).deleteOne({ _id: id });
};
