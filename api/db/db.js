const { MongoClient, ServerApiVersion } = require('mongodb');
require('dotenv').config({ path: '.env.local' });
const uri = process.env.DATABASE_URL;

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

let db;

const connectToDatabase = async () => {
  try {
    await client.connect();
    db = client.db('animals');
    console.log('Connected to the database');
    return db;
  } catch (error) {
    console.error('Error connecting to the database:', error);
    throw error;
  }
};

const closeDatabaseConnection = async () => {
  try {
    await client.close();
    console.log('Connection closed');
  } catch (error) {
    console.error('Error closing the database connection:', error);
  }
};

module.exports = {
  connectToDatabase,
  closeDatabaseConnection,
  getDatabase: () => db,
};
