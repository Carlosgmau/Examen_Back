import dotenv from "dotenv";
import jwt from "jsonwebtoken";
import { getDB } from "./db/mongo";
import { ObjectId } from "mongodb";

dotenv.config();


const JWT_SECRET = process.env.JWT_SECRET || process.env.SECRET || "dev_secret";


type TokenPayload = { userId: string };


export const signToken = (userId: string): string => {
  return jwt.sign({ userId }, JWT_SECRET, { expiresIn: "8h" });
};


export const verifyToken = (token: string): TokenPayload | null => {
  try {
    return jwt.verify(token, JWT_SECRET) as TokenPayload;
  } catch {
    return null;
  }
};


export const getUserFromToken = async (authHeader?: string | null) => {
  if (!authHeader) return null; 

  const token = authHeader.startsWith("Bearer ") ? authHeader.slice(7) : authHeader;
  const payload = verifyToken(token);
  if (!payload) return null; 

  const db = getDB(); 
  
  return db.collection("users").findOne(
    { _id: new ObjectId(payload.userId) },
    { projection: { password: 0 } }
  );
};