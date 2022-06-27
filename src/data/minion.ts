import { World } from "./world";

export type BulletModifier = "missle" | "bomb" | "bullet" | "freeze" | "explode";
export type MinionType = "ufo" | "airballoon" | "land";


const majorModifiers: Array<BulletModifier> = ["missle", "bomb", "bullet"];
const minorModifiers: Array<BulletModifier> = ["freeze", "explode"];
const minionTypeList:MinionType[] = ["ufo", "airballoon", "land"];


export interface Minion {
  owner: string; //owner block number
  id: string;
  location: number | null;
  x: number;
  y: number;
  power: number;
  frequency: number;
  modifier: Array<BulletModifier>;
  contribution: number;
  style: number;
  type: MinionType;
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
      location:null,
      id:id,
      owner:owner,
      modifier: randomModifier(minionType),
      contribution:0,
      style: Math.floor(Math.random()*4),
      type: minionType//minionTypeList[Math.floor(Math.random()*3)]
    };
  world.registerMinion(m);
  return m;
}
