const DBConfig = {"db": "mongodb://localhost:27017"};
const MongoClient = require("mongodb").MongoClient;

const DB_CONN_STRING="mongodb://localhost:27017/"
const DB_NAME="punkixel"
import * as mongoDB from "mongodb";
import {individualWidth, individualHeight, Minion, InstanceInfo, BulletModifier, MinionType, Player} from "./types";

const content_size = individualWidth * individualHeight;

interface PunkixelCollections {
  players?: mongoDB.Collection,
  instances?: mongoDB.Collection,
  minions?: mongoDB.Collection,
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
  const db: mongoDB.Db = client.db(DB_NAME);
  if (reset) {
    db.dropCollection("instances");
    db.dropCollection("players");
    db.dropCollection("minions");
  }
  dbClient = {
      instances: await getOrCreateCollection(db, "instances"),
      players: await getOrCreateCollection(db, "players"),
      minions: await getOrCreateCollection(db, "minions"),
      client: client,
  }
}

function createInstance(id:string, owner: string): InstanceInfo{
  let content = [
    new Array(individualHeight * individualWidth),
    new Array(individualHeight * individualWidth),
    new Array(individualHeight * individualWidth)
  ];
  for (var i=0; i<content_size; i++) {
      content[0][i] = 0;
      content[1][i] = 0;
      content[2][i] = 0;
  }
  let instance = {
    content: content,
    minions: [],
    drops:[],
    id:id,
    ratio:0.4,
    owner: owner,
    background: 0,
    pph: 0,
    reward: 0,
    basePPH: 0,
    sketched: false,
  };
  return instance;
}

export async function getInstance(id:string): Promise<InstanceInfo> {
  const instance = (await dbClient.instances!.findOne({id: id})) as unknown as InstanceInfo;
  return instance;
}

export async function registerInstance(id: string, owner: string) {
  let instance = createInstance(id, owner);
  return await dbClient.instances!.insertOne(instance);
}



const majorModifiers: Array<BulletModifier> = ["missle", "bomb", "bullet"];
const minorModifiers: Array<BulletModifier> = ["freeze", "explode"];
const minionTypeList:MinionType[] = ["ufo", "airballoon", "land"];


function randomInRange(from:number, to:number) {
  return from + Math.floor(Math.random()*(to - from));
}

function generateRandomPos(t: MinionType) {
  if(t==="ufo") {
    return [randomInRange(0,900), 400 - randomInRange(300,350)];
  } else if (t==="land") {
    return [randomInRange(0,900), 400 - 70];
  } else if (t==="airballoon") {
    return [randomInRange(0,900), 400 - randomInRange(200,300)];
  } else {
    return [0,0];
  }
}

function randomModifier(t:MinionType): Array<BulletModifier> {
  let minorModifier = minorModifiers[Math.floor(Math.random()*2)];
  if(t==="ufo") {
    return [majorModifiers[0], minorModifier];
  } else if (t==="airballoon") {
    return [majorModifiers[1], minorModifier];
  } else if (t==="land") {
    return [majorModifiers[2], minorModifier];
  }
  return [];
}

export function createMinion(owner:string): Minion {
  let minionType = minionTypeList[Math.floor(Math.random()*3)];
  let id = "minion-" + Math.ceil(Math.random() * 100000);
  let frequency = Math.ceil(Math.random()*30 + 5);
  let power = Math.ceil(Math.random()*5 + 5);
  let pos = generateRandomPos(minionType);
  let m = {
      x:pos[0],
      y:pos[1],
      frequency:frequency,
      power:power,
      location:null,
      id:id,
      owner:owner,
      modifier: randomModifier(minionType),
      contribution:0,
      style: Math.floor(Math.random()*4),
      type: minionType//minionTypeList[Math.floor(Math.random()*3)]
    };
  return m;
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
  updatePlayer(owner, player);
  return minion.id;
}

export async function registerPlayer(id: string) {
  let index = dbClient.instances!.count;
  let player = {
    id: id,
    energy: 50,
    punkxiel: 10000,
    ranking: 99,
    pph: 0,
    voucher: 1,
    palettes: [{
      name: "basic",
      palettes: [],
    },
    {
      name: "spin",
      palettes: []
    },
    {
      name: "dilation",
      palettes: [],
    }
    ],
    inventory: [null, null, null, null, null],
    homeIndex: index,
  };
  await registerInstance(id, id);
  let ret = await dbClient.players!.insertOne(player);
  return ret;
}


export async function allInstances() {
  let query = await dbClient.instances!.find({}).limit(10);
  let instances:any = [];
  await query.forEach((q) => instances.push(q));
  return instances;

}

export async function getInstanceByIndex(index: number) {

  let query = await dbClient.instances!.find({}).limit(10);
  let instances:any = [];
  await query.forEach((q) => instances.push(q));
  /* FIXME: TODO, getInstance by Index */
  return instances[0];

}

export async function allPlayers() {
  let query =  await dbClient.players!.find({});
  let players:any = [];
  await query.forEach((q) => players.push(q));
  return players;
}

export async function allMinions() {
  let query = await dbClient.minions!.find({});
  let minions:any = [];
  await query.forEach((q) => minions.push(q));
  return minions;
}

export async function getMinion(mid: string): Promise<Minion> {
  let query = await dbClient.minions!.findOne({id:mid});
  console.log (query);
  return query as unknown as Minion;
}

export async function updateMinion(mid: string, minion: Minion) {
  await dbClient.minions!.updateOne({id: mid }, { $set: minion});
}

export async function claimDrop(owner: string, drops:string[]) {
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
  updateMinion(mid, minion);
  return;
}

export async function clearMinionContribute(mid: string) {
  let minion = await getMinion(mid);
  minion.contribution = 0;
  updateMinion(mid, minion);
  return;
}

export async function loadWorld() {
  return null;
}
