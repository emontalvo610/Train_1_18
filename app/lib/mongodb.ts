// lib/mongodb.ts
import mongoose from "mongoose";

if (!process.env.NEXT_PUBLIC_MONGODB_URI) {
  throw new Error("Please add your MONGODB_URI to .env.local");
}

const MONGODB_URI: string = process.env.NEXT_PUBLIC_MONGODB_URI;

interface Connection {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
}

const cached: Connection = {
  conn: null,
  promise: null,
};

async function dbConnect() {
  // if (cached.conn) {
  //   console.log("cached");
  //   return cached.conn;
  // }

  // if (!cached.promise) {

  cached.promise = mongoose.connect(MONGODB_URI, {
    dbName: "test"
  });
  // }

  try {
    cached.conn = await cached.promise;
  } catch (e) {
    cached.promise = null;
    throw e;
  }

  return cached.conn;
}

export default dbConnect;
