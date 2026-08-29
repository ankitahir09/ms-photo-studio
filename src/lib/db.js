import mongoose from "mongoose";

let cachedClient = null;

export async function getMongoClient() {
  if (!mongoose.connection.readyState) {
    if (!process.env.MONGO_URI) {
      throw new Error("MONGO_URI is not defined");
    }
    await mongoose.connect(process.env.MONGO_URI);
  }
  
  if (!cachedClient) {
    cachedClient = mongoose.connection.getClient();
  }
  
  return cachedClient;
}

export async function connectToDatabase() {
  if (mongoose.connection.readyState >= 1) return;
  if (!process.env.MONGO_URI) {
    throw new Error("MONGO_URI is not defined");
  }
  return mongoose.connect(process.env.MONGO_URI);
}
