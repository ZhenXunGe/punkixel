function getRandomInt(max:number) {
  return Math.floor(Math.random() * max);
}

interface item {
  x: number;
  y: number;
  w: number;
  h: number;
}

export function sketch(w:number, h:number, n:number) {
  let items = new Array<item>(0);
  let start = 5;
  let base_width = 20;
  let base_height = 10;
  let ceil_height = 60;
  let gap = 5;
  let sy = 10;
  for (var i=0; i<n; i++) {
    let sw = getRandomInt(base_width) + 3;
    let end = start + sw + getRandomInt(gap);
    if (end > w) {
       break;
    }
    items.push({
      h: getRandomInt(ceil_height) + base_height,
      x: start,
      w: sw,
      y: sy + getRandomInt(1),
    });
    start = end;
  }
  console.log(items);
  return items;
}
