const DBConfig = {"db": "mongodb://localhost:27017"};
const MongoClient = require("mongodb").MongoClient;

const DB_CONN_STRING="mongodb://localhost:27017/"
const DB_NAME="punkixel"
import * as mongoDB from "mongodb";

interface PunkixelCollections {
  players?: mongoDB.Collection,
  instances?: mongoDB.Collection,
  minions?: mongoDB.Collection,
  client?: mongoDB.MongoClient,
}

let dbClient: PunkixelCollections = {};

import {Minion} from "../src/data/minion";

async function getOrCreateCollection(db:mongoDB.Db, cname: string, index?: any): Promise<mongoDB.Collection> {
  let collections = await db.listCollections({ name: cname}).toArray();
  if (collections.length == 0) {
    let c = await db.createCollection(cname);
    if (index !== undefined) {
        c.createIndex(index, {unique: true});
    }
    return c;
  } else {
    return db.collection(cname);
  }
}

export async function connectToDatabase () {
  const client: mongoDB.MongoClient = new mongoDB.MongoClient(DB_CONN_STRING);
  await client.connect();
  const db: mongoDB.Db = client.db(DB_NAME);
  dbClient = {
      instances: await getOrCreateCollection(db, "instances"),
      players: await getOrCreateCollection(db, "players"),
      minions: await getOrCreateCollection(db, "minions"),
      client: client,
  }
}

async function initInstances() {

}

