export interface Minion {
  home: number; //owner block number
  id: string;
  location: number | null;
  x: number;
  y: number;
  power: number;
  frequency: number;
  countingdown: number;
}

export const randomMinion = (home:number) => {
  let x = Math.random() * 600;
  let y = Math.random() * 200;
  let id = "minion-" + Math.ceil(Math.random() * 100000);
  console.log("randomx is", x);
  let frequency = Math.ceil(Math.random()*30 + 5);
  let power = Math.ceil(Math.random()*5 + 5);
  return {x:x+50, y:y+50, frequency:frequency, power:power, countingdown:2, location:null, id:id, home:home};
}

export function getMinionById(instances:Array<Minion>, id:string):Minion {
  let minion = instances.find((m)=>{return (m.id === id)});
  return minion!;
}

export function availableMinions(instances:Array<Minion|null>) :Array<Minion> {
  return instances.filter((m)=>{return (m !== null)}).map((x) => {return x!});
}
