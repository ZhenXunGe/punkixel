import { Drawer } from "../data/draw";
import { findGrayColor } from "../data/palette";
import { Sprite } from "../sprite/sprite";
import sketch01 from "./sketch-01.png";
import sketch02 from "./sketch-02.png";
import sketch03 from "./sketch-03.png";
export const clips = [
  {name:"default", src: [sketch01, sketch02,sketch03]}
]

function getRandomInt(max:number) {
  return Math.floor(Math.random() * max-0.00001);
}

interface item {
  x: number;
  y: number;
  w: number;
  h: number;
}

export function sketch(w:number, h:number, n:number, front:number=0) {
  let items = new Array<item>(0);
  let start = 5;
  let base_width = 10 + (front*2);
  let base_height = 10;
  let ceil_height = 75 + (front*10);
  let gap = 10;
  let sy = 10;
  for (var i=0; i<n; i++) {
    let sw = getRandomInt(base_width) + 10;
    let end = start + sw + getRandomInt(gap);
    if (end > w) {
       break;
    }
    let height_ext = getRandomInt(ceil_height) + base_height;
    if (height_ext > 90) {height_ext = 90;};
    items.push({
      h: height_ext,
      x: start,
      w: sw,
      y: sy,
    });
    start = end;
  }
  console.log(items);
  return items;
}

export function sketchBuild(drawer:Drawer, canvan:HTMLCanvasElement, 
  sprite:Sprite, width:number,
  height:number,
  sx:number,
  sy:number,
  gray:number) {
  let ctx = canvan.getContext("2d")!;
  let idx = getRandomInt(3);
  let image = sprite.getFrame("default",idx);
  ctx.drawImage(image, 0, 0, width, height);
  let pixels = ctx.getImageData(0, 0, width, height);
  for(var x=0; x<width; x++) {
    for (var y=0; y<height; y++) {
      let idx = (y*width + x) * 4;
      let r = pixels.data[idx];
      let g = pixels.data[idx+1];
      let b = pixels.data[idx+2];
      let dyeidx = findGrayColor(r, g, b);
      //drawer.setPixelByCor(sx+x, sy+height-y, 18);
      if (dyeidx === 16) {
        dyeidx = 0;
        continue;
      }
      drawer.setPixelByCor(sx + x , sy + height - y, dyeidx+gray);
    }
  }
}