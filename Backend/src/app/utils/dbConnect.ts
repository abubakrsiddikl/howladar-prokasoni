/* eslint-disable @typescript-eslint/no-explicit-any */
import mongoose from "mongoose";
import { envVars } from "../config/env";

const MONGODB_URI = envVars.DB_URL;

if (!MONGODB_URI) {
  throw new Error("Please define the DB_URL environment variable");
}

let cached = (global as any).mongoose;

if (!cached) {
  cached = (global as any).mongoose = { conn: null, promise: null };
}

export async function dbConnect() {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    cached.promise = mongoose.connect(MONGODB_URI, {
      bufferCommands: false,
      maxPoolSize: 10,
    });
  }

  cached.conn = await cached.promise;
  return cached.conn;
}
