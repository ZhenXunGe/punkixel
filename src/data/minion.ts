export interface Minion {
  x: number;
  y: number;
  speed: number;
  frequency: number;
  countingdown: number;
}

export const randomMinion = () => {
  let x = Math.random() * 600;
  let y = Math.random() * 200;
  console.log("randomx is", x);
  let frequency = Math.ceil(Math.random()*30 + 5);
  let speed = Math.ceil(Math.random()*10 + 5);
  return {x:x+50, y:y+50, frequency:frequency, speed:speed, countingdown:2};
}