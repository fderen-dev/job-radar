import dotenv from 'dotenv';
import { MongoClient, ServerApiVersion } from 'mongodb';

dotenv.config();

function mongoConnectionStringFactory(userName: string, password: string): string {
  return `mongodb+srv://${userName}:${password}@cluster0.navgbow.mongodb.net/?retryWrites=true&w=majority`;
}

export async function connectDatabase(): Promise<void> {
  const mongoConnectionString = mongoConnectionStringFactory(process.env.MONGO_USER ?? '', process.env.MONGO_PASSWORD ?? '');
  const client = new MongoClient(mongoConnectionString, {
    serverApi: {
      version: ServerApiVersion.v1,
      strict: true,
      deprecationErrors: true,
    },
  });

  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
    // Send a ping to confirm a successful connection
    await client.db('admin').command({ ping: 1 });
    console.log('Pinged your deployment. You successfully connected to MongoDB!');
  } finally {
    // Ensures that the client will close when you finish/error
    await client.close();
  }
}
