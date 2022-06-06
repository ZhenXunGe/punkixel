import { BombBullet, BulletInfo, StraightBullet, TrackBullet } from "../dynamic/bullet";
import { World } from "./world";

export type BulletModifier = "missle" | "bomb" | "bullet" | "freeze" | "explode";
const majorModifiers: Array<BulletModifier> = ["missle", "bomb", "bullet"];
const minorModifiers: Array<BulletModifier> = ["freeze", "explode"];
type MinionType = "ufo" | "airballoon" | "land";

const minionTypeList:MinionType[] = ["ufo", "airballoon", "land"];


export interface Minion {
  owner: string; //owner block number
  id: string;
  location: number | null;
  x: number;
  y: number;
  power: number;
  frequency: number;
  countingdown: number;
  modifier: Array<BulletModifier>;
  contribution: number;
  style: number;
  type: MinionType;
  bulletPos: number[];
}

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

function generateBulletPos(t:MinionType) {
  if(t==="ufo") {
    return [25,40];
  } else if (t==="land") {
    return [25,15];
  } else if (t==="airballoon") {
    return [25,35];
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


export function randomMinion(owner:string, world:World): Minion {
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
      countingdown:2,
      location:null,
      id:id,
      owner:owner,
      modifier: randomModifier(minionType),
      contribution:0,
      style: Math.floor(Math.random()*4),
      bulletPos: generateBulletPos(minionType),
      type: minionType//minionTypeList[Math.floor(Math.random()*3)]
    };
  world.registerMinion(m);
  return m;
}

export function getMinionById(instances:Array<Minion>, id:string):Minion {
  let minion = instances.find((m)=>{return (m.id === id)});
  return minion!;
}

export function availableMinions(instances:Array<Minion|null>) :Array<Minion> {
  return instances.filter((m)=>{return (m !== null)}).map((x) => {return x!});
}

export function spawnBullet(m:Minion, alien_x:number, alien_y:number, offsetX:number, offsetY:number):BulletInfo {
  let start_x = m.x + m.bulletPos[0] + offsetX;
  let start_y = m.y + m.bulletPos[1] + offsetY;
  if (m.modifier[0] == "missle") {
    let rotate = 0;
    if (m.x > alien_x) {
      rotate = 180;
    }
    return new TrackBullet(start_x, start_y, 20, m.power, m.modifier[1], 0, rotate, m.id);
  } else if (m.modifier[0] == "bomb") {
    let rotate = Math.atan2(alien_y - m.y, alien_x - m.x)*180/Math.PI;
    return new BombBullet(start_x, start_y, 10, m.power, m.modifier[1], 20, rotate, m.id);
  }
  return new StraightBullet(start_x, start_y, 20, m.power, m.modifier[1], 20, 0, m.id);
} 
