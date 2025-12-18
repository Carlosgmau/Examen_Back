import { ObjectId } from "mongodb";
import { getDB } from "../db/mongo";
import bcrypt from "bcryptjs";

export type TrainerDB = {
  _id: ObjectId;
  name: string;
  password: string;
  team: ObjectId[];
};

const COLLECTION = "trainers";

export const createTrainer = async (name: string, password: string) => {
  const db = getDB();

  const exists = await db
    .collection<TrainerDB>(COLLECTION)
    .findOne({ name });

  if (exists) throw new Error("El entrenador yaexiste");

  const hashed = await bcrypt.hash(password, 10);

  const trainer: Omit<TrainerDB, "_id"> = {
    name,
    password: hashed,
    team: [],
  };



  const res = await db
    .collection<TrainerDB>(COLLECTION)
    .insertOne(trainer as any);

  return { _id: res.insertedId, name };
};



export const findTrainerByName = async (name: string) => {
  return getDB()
    .collection<TrainerDB>(COLLECTION)
    .findOne({ name });
};



export const findTrainerById = async (id: string) => {
  return getDB()
    .collection<TrainerDB>(COLLECTION)
    .findOne({ _id: new ObjectId(id) });
};



export const addPokemonToTrainer = async (
  trainerId: ObjectId,
  ownedId: ObjectId
) => {
  await getDB()
    .collection<TrainerDB>(COLLECTION)
    .updateOne(
      { _id: trainerId },
      { $push: { team: ownedId } as any } 
    );
};



export const removePokemonFromTrainer = async (
  trainerId: ObjectId,
  ownedId: ObjectId
) => {
  await getDB()
    .collection<TrainerDB>(COLLECTION)
    .updateOne(
      { _id: trainerId },
      { $pull: { team: ownedId } as any } 
    );
};

