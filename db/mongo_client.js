const { MongoClient } = require('mongodb');

const uri = 'mongodb://localhost:27017';
const dbName = 'slack_scraper';

let client;

async function connectToMongo() {
  if (!client) {
    client = new MongoClient(uri);
    await client.connect();
    console.log("Connected to MongoDB");
  }
  return client.db(dbName);
}

async function closeMongo() {
  if (client) {
    await client.close();
    console.log("Closed MongoDB connection");
  }
}

module.exports = { connectToMongo, closeMongo };
