import mongoose from "mongoose"

interface MongooseCache {
  conn: typeof mongoose | null
  promise: Promise<typeof mongoose> | null
}

// @ts-ignore - reuse across reloads in dev
const cached: MongooseCache = global.mongooseCache || { conn: null, promise: null }
// @ts-ignore
global.mongooseCache = cached

export async function connectMongo() {
  const MONGODB_URI = process.env.MONGODB_URI
  if (!MONGODB_URI) {
    console.error("[v0] connectMongo: Missing MONGODB_URI environment variable")
    throw new Error("Missing MONGODB_URI environment variable")
  }

  if (cached.conn) return cached.conn
  if (!cached.promise) {
    console.log("[v0] connectMongo: establishing new connection")
    cached.promise = mongoose.connect(MONGODB_URI, {
      dbName: process.env.MONGODB_DB || undefined,
    })
  }
  cached.conn = await cached.promise
  return cached.conn
}
