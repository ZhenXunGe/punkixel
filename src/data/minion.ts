import { BulletInfo, StraightBullet, TrackBullet } from "../dynamic/bullet";

type Modifier = "splash" | "track" | "straight" | "freeze" | "ignite";

function randomModifier(): Array<Modifier> {
  let r = Math.floor(Math.random()*2);
  if (r==1) {
    return ["track", "splash"];
  }
  return ["straight", "splash"];
}

export interface Minion {
  home: number; //owner block number
  id: string;
  location: number | null;
  x: number;
  y: number;
  power: number;
  frequency: number;
  countingdown: number;
  modifier: Array<Modifier>;
}

const mWidth = 50;
const mHeight = 50;

export function randomMinion(home:number): Minion {
  let x = Math.random() * 900;
  let y = Math.random() * 200;
  let id = "minion-" + Math.ceil(Math.random() * 100000);
  console.log("randomx is", x);
  let frequency = Math.ceil(Math.random()*30 + 5);
  let power = Math.ceil(Math.random()*5 + 5);
  return {x:x+50, y:y+50, frequency:frequency, power:power, countingdown:2, location:null, id:id, home:home, modifier:randomModifier()};
}

export function getMinionById(instances:Array<Minion>, id:string):Minion {
  let minion = instances.find((m)=>{return (m.id === id)});
  return minion!;
}

export function availableMinions(instances:Array<Minion|null>) :Array<Minion> {
  return instances.filter((m)=>{return (m !== null)}).map((x) => {return x!});
}

export function spawnBullet(m:Minion, alien_x:number, alien_y:number, width:number, power: number, speed:number, source:number):BulletInfo {
  if (m.modifier[0] == "track") {
    let rotate = 0;
    if (m.x > alien_x) {
      rotate = 180;
    }
    return new TrackBullet(m.x + 20, m.y + 20, width, power, 0, rotate, source);
  } else if (m.modifier[0] == "straight") {
    let rotate = Math.atan2(alien_y - m.y, alien_x - m.x)*180/Math.PI;
    return new StraightBullet(m.x + 20, m.y + 20, width, power, 20, rotate, source);
  }
  return new StraightBullet(m.x+20, m.y+20, width, power, 10, 0, source);
} 
