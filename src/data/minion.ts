export interface Minion {
  id: string;
  location: number | null;
  x: number;
  y: number;
  speed: number;
  frequency: number;
  countingdown: number;
}

export const randomMinion = () => {
  let x = Math.random() * 600;
  let y = Math.random() * 200;
  let id = "minion-" + Math.ceil(Math.random() * 100000);
  console.log("randomx is", x);
  let frequency = Math.ceil(Math.random()*30 + 5);
  let speed = Math.ceil(Math.random()*10 + 5);
  return {x:x+50, y:y+50, frequency:frequency, speed:speed, countingdown:2, location:null, id:id};
}

export function getMinionById(instances:Array<Minion>, id:string):Minion {
  let minion = instances.find((m)=>{return (m.id === id)});
  return {
    x:minion.x,
    y:minion.y,
    id:minion.id,
    frequency:minion.frequency,
    speed:minion.frequency,
    location:null,
    countingdown:minion.frequency,
  }
}

export function availableMinions(instances:Array<Minion|null>) :Array<Minion> {
  return instances.filter((m)=>{return (m !== null)}).map((x) => {return x!});
}


