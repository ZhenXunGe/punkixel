import { BulletInfo, StraightBullet, TrackBullet } from "../dynamic/bullet";
import { World } from "./world";

type Modifier = "splash" | "track" | "straight" | "freeze" | "ignite";

function randomModifier(): Array<Modifier> {
  let r = Math.floor(Math.random()*2);
  if (r==1) {
    return ["track", "splash"];
  }
  return ["straight", "splash"];
}

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
}

const mWidth = 50;
const mHeight = 50;

const minionStyle = ["default", "extend"];

export function randomMinion(owner:string, world:World): Minion {
  let x = Math.random() * 900;
  let y = Math.random() * 200;
  let id = "minion-" + Math.ceil(Math.random() * 100000);
  console.log("randomx is", x);
  let frequency = Math.ceil(Math.random()*30 + 5);
  let power = Math.ceil(Math.random()*5 + 5);
  let m = {
      x:x+50,
      y:y+50,
      frequency:frequency,
      power:power,
      countingdown:2,
      location:null,
      id:id,
      owner:owner,
      modifier:randomModifier(),
      contribution:0,
      style: Math.floor(Math.random()*5),
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

export function spawnBullet(m:Minion, alien_x:number, alien_y:number):BulletInfo {
  if (m.modifier[0] == "track") {
    let rotate = 0;
    if (m.x > alien_x) {
      rotate = 180;
    }
    return new TrackBullet(m.x + 20, m.y + 20, 20, m.power, 0, rotate, m.id);
  } else if (m.modifier[0] == "straight") {
    let rotate = Math.atan2(alien_y - m.y, alien_x - m.x)*180/Math.PI;
    return new StraightBullet(m.x + 20, m.y + 20, 10, m.power, 20, rotate, m.id);
  }
  return new StraightBullet(m.x+20, m.y+20, 20, m.power, 20, 0, m.id);
} 
