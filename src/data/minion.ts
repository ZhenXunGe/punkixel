import { BulletInfo, StraightBullet, TrackBullet } from "../dynamic/bullet";
import { World } from "./world";

type Modifier = "splash" | "track" | "straight" | "freeze" | "ignite";
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
  modifier: Array<Modifier>;
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

function randomModifier(): Array<Modifier> {
  let r = Math.floor(Math.random()*2);
  if (r==1) {
    return ["track", "splash"];
  }
  return ["straight", "splash"];
}

function generateModifier(t:MinionType):Modifier {
  if(t==="ufo") {
    return "track";
  } else if (t==="land") {
    return "straight";
  } else if (t==="airballoon") {
    return "straight";
  }
  return "straight";
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
      modifier:[generateModifier(minionType)],
      contribution:0,
      style: Math.floor(Math.random()*2),
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
  if (m.modifier[0] == "track") {
    let rotate = 0;
    if (m.x > alien_x) {
      rotate = 180;
    }
    return new TrackBullet(start_x, start_y, 20, m.power, 0, rotate, m.id);
  } else if (m.modifier[0] == "straight") {
    let rotate = Math.atan2(alien_y - m.y, alien_x - m.x)*180/Math.PI;
    return new StraightBullet(start_x, start_y, 10, m.power, 20, rotate, m.id);
  }
  return new StraightBullet(start_x, start_y, 20, m.power, 20, 0, m.id);
} 
