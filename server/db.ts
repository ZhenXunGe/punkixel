const DBConfig = {"db": "mongodb://localhost:27017"};
const MongoClient = require("mongodb").MongoClient;

const DB_CONN_STRING="mongodb://localhost:27017/"
const DB_NAME="punkixel"
import * as mongoDB from "mongodb";
import { Minion, InstanceInfo, Alien, Player, SysEvent} from "./types";
import { getRandomInt, createMinion, createInstance, newPlayer, resetMinion } from "./generator";

interface PunkixelCollections {
  players?: mongoDB.Collection,
  instances?: mongoDB.Collection,
  minions?: mongoDB.Collection,
  events?: mongoDB.Collection,
  aliens?: mongoDB.Collection,
  client?: mongoDB.MongoClient,
}

export var dbClient: PunkixelCollections = {};

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

export async function connectToDatabase (reset:boolean) {
  const client: mongoDB.MongoClient = new mongoDB.MongoClient(DB_CONN_STRING);
  await client.connect();
  console.log("connecting database ...");
  const db: mongoDB.Db = client.db(DB_NAME);
  if (reset) {
    try {
      await db.dropCollection("instances");
      await db.dropCollection("players");
      await db.dropCollection("minions");
      await db.dropCollection("events");
      await db.dropCollection("aliens");
    } catch {
      console.log("ignore error when drop collections!");
    }
  }
  dbClient = {
      instances: await getOrCreateCollection(db, "instances"),
      players: await getOrCreateCollection(db, "players"),
      minions: await getOrCreateCollection(db, "minions"),
      events: await getOrCreateCollection(db, "events"),
      aliens: await getOrCreateCollection(db, "aliens"),
      client: client,
  }
}

export async function registerEvent(event: SysEvent) {
  let index = await dbClient.events!.count();
  event.id = index;
  return await dbClient.events!.insertOne(event);
}

export async function fetchEvents(start: number): Promise<Array<SysEvent>> {
  let index = dbClient.events!.find({});
  let eles:Array<SysEvent> = [];
  let r = await index.skip(start).toArray();
  r.forEach((x) => eles.push(x as unknown as SysEvent));
  return eles;
}

export async function getInstance(id:string): Promise<InstanceInfo> {
  const instance = (await dbClient.instances!.findOne({id: id})) as unknown as InstanceInfo;
  return instance;
}

export async function registerAlien(alien: Alien) {
  let index = await dbClient.aliens!.count();
  alien.id = index.toString();
  console.log("register alien:", alien, index);
  return await dbClient.aliens!.insertOne(alien);
}

export async function getAlien(id: string): Promise<Alien> {
  const alien = (await dbClient.aliens!.findOne({id: id})) as unknown as Alien;
  return alien;
}

export async function pickRandomAlien(): Promise<Alien> {
  let index = await dbClient.aliens!.count();
  let id = getRandomInt(0, index).toString();
  console.log("pick alien:", id);
  const alien = (await dbClient.aliens!.findOne({id: id})) as unknown as Alien;
  return alien;
}


export async function registerInstance(id: string, owner: string) {
  let index = await dbClient.instances!.count();
  let instance = createInstance(owner);
  instance.index = index;
  return await dbClient.instances!.insertOne(instance);
}

export async function getPlayer(id: string) {
  const player = (await dbClient.players!.findOne({id: id})) as unknown as Player;
  return player;
}

export async function updatePlayer(id:string, player:Player) {
  await dbClient.players!.updateOne({id: id }, { $set: player });
}

export async function registerMinion(owner: string, slot:number): Promise<string> {
  let minion = createMinion(owner);
  let player = await getPlayer(owner);
  player.inventory[slot] = minion.id;
  await dbClient.minions!.insertOne(minion);
  console.log("db.ts register minion", player);
  await updatePlayer(owner, player);
  return minion.id;
}

export async function rerollMinion(mid: string): Promise<Minion> {
  let minion = await getMinion(mid);
  minion = resetMinion(minion);
  let loc = minion.location;
  if (loc != null) {
    let instance = await getInstanceByIndex(loc);
    var index = instance.minions.indexOf(mid, 0);
    if (index > -1) {
      instance.minions.splice(index, 1);
    }
    updateInstance(instance);
  }
  minion.location = null;
  await dbClient.minions!.updateOne({id:minion.id}, {$set: minion});
  return minion;
}

export async function registerPlayer(id: string) {
  let index = await dbClient.instances!.count();
  let player = newPlayer(id, index);
  await registerInstance(id, id);
  let ret = await dbClient.players!.insertOne(player);
  let i = await dbClient.instances!.count();
  console.log("total instance after register player:", i);
  return ret;
}


export async function allInstances() {
  let query = await dbClient.instances!.find({}).limit(100);
  let instances:any = [];
  await query.forEach((q) => instances.push(q));
  return instances;

}

export async function getInstanceByIndex(index: number) {
  console.log("getting instance", index);
  let query = await dbClient.instances!.findOne({index: index});
  return query as unknown as InstanceInfo;
}

export async function updateInstance(instance: InstanceInfo) {
  await dbClient.instances!.updateOne({index: instance.index}, { $set: instance});
}

export async function allPlayers() {
  let query =  dbClient.players!.find({});
  let players:any = [];
  await query.forEach((q) => players.push(q));
  return players;
}

export async function allMinions() {
  let query = dbClient.minions!.find({});
  let minions:any = [];
  await query.forEach((q) => minions.push(q));
  return minions;
}

export async function getMinion(mid: string): Promise<Minion> {
  let query = await dbClient.minions!.findOne({id:mid});
  return query as unknown as Minion;
}

export async function updateMinion(minion: Minion) {
  await dbClient.minions!.updateOne({id: minion.id}, { $set: minion});
}


export async function protectInstance(minion:Minion, instance: InstanceInfo): Promise<Minion> {
  if (minion.location != null) {
     throw new Error("Minion is not idle");
  }
  instance.minions.push(minion.id);
  minion.location = instance.index;
  await updateMinion(minion);
  await updateInstance(instance);
  return minion
}

export async function claimDrop(owner: string, amount:number, drops:string[]) {
  let player = await getPlayer(owner);
  player.punkxiel += amount;
  updatePlayer(owner, player);
  return;
}

export async function claimRewardPunkixel(owner: string, amount:number) {
  let player = await getPlayer(owner);
  player.punkxiel += amount;
  updatePlayer(owner, player);
}

export async function incMinionContribute(mid: string, contribute: number) {
  let minion = await getMinion(mid);
  minion.contribution += contribute;
  updateMinion(minion);
  return;
}

export async function clearMinionContribute(mid: string) {
  let minion = await getMinion(mid);
  minion.contribution = 0;
  updateMinion(minion);
  return;
}

export async function totalInstance() {
  let totalInstance:number = await dbClient.instances!.count();
  return totalInstance;
}

export async function loadWorld() {
  let totalInstance:number = await dbClient.instances!.count();
  let totalEvents:number = await dbClient.events!.count();
  return {
    totalInstance: totalInstance,
    totalEvents: totalEvents,
  }
}
