import { MongoClient, type Db } from "mongodb";

const uri = process.env.DATABASE_URL;

if (!uri) {
  throw new Error(
    "DATABASE_URL environment variable must be set for MongoDB connection."
  );
}

const explicitDbName = process.env.MONGODB_DB;

type GlobalMongo = {
  _mongoClient?: MongoClient;
  _mongoClientPromise?: Promise<MongoClient>;
  _mongoDb?: Db;
};

// Cache client and promise on globalThis to prevent multiple connections
// in dev (hot reload) and serverless environments.
const globalForMongo = globalThis as unknown as GlobalMongo;

let client: MongoClient;
let clientPromise: Promise<MongoClient>;

if (globalForMongo._mongoClient && globalForMongo._mongoClientPromise) {
  client = globalForMongo._mongoClient;
  clientPromise = globalForMongo._mongoClientPromise;
} else {
  client = new MongoClient(uri);
  clientPromise = client.connect();
  globalForMongo._mongoClient = client;
  globalForMongo._mongoClientPromise = clientPromise;
}

/**
 * Get or create the shared MongoClient instance.
 */
export async function getMongoClient(): Promise<MongoClient> {
  return clientPromise;
}

/**
 * Get a Db handle.
 *
 * @param dbName optional database name, defaults to the one from the connection string or MONGODB_DB
 */
export async function getDb(dbName?: string): Promise<Db> {
  const mongoClient = await getMongoClient();
  return mongoClient.db(dbName ?? explicitDbName);
}

// For libraries that expect a Db instance synchronously (like better-auth),
// we also expose a lazily-connected Db handle. MongoClient connects on first use.
export const db: Db = globalForMongo._mongoDb ?? client.db(explicitDbName);

if (!globalForMongo._mongoDb) {
  globalForMongo._mongoDb = db;
}
