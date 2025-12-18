import { MongoClient, Db } from "mongodb";
import dotenv from "dotenv";

dotenv.config();

const MONGO_URI = process.env.MONGO_URI!;
const DB_NAME = process.env.DB_NAME || "test";

let client: MongoClient;
let db: Db;


export const connectToMongoDB = async (): Promise<void> => {
  try {
    client = new MongoClient(MONGO_URI);
    await client.connect();
    db = client.db(DB_NAME);
    console.log(`Conectado a MongoDB Atlas -> DB: ${DB_NAME}`);
  } catch (error) {
    console.error("Error al conectar a MongoDB:", error);
    process.exit(1);
  }
};


export const getDB = (): Db => {
  if (!db) {
    throw new Error("MongoDB no está conectado.");
  }
  return db;
};


export const getClient = (): MongoClient => {
  if (!client) {
    throw new Error("MongoDB no está conectado.");
  }
  return client;
};