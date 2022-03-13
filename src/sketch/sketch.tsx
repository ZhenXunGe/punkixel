import { Drawer } from "../data/draw";
import { findGrayColor } from "../data/palette";
import { Sprite } from "../sprite/sprite";

import build01 from "./resource/sketch-gray-01.png";
import build02 from "./resource/sketch-gray-02.png";
import build03 from "./resource/sketch-gray-03.png";
import build04 from "./resource/sketch-gray-04.png";
import build05 from "./resource/sketch-gray-05.png";

import road01 from "./resource/sketch-road-01.png";
import road02 from "./resource/sketch-road-02.png";
import road03 from "./resource/sketch-road-03.png";
import road04 from "./resource/sketch-road-04.png";
export const clips = [
  { name: "building", src: [build01, build02, build03, build04, build05] },
  { name: "road", src: [road01, road02, road03, road04] }
]

export const mainCategory = ["building"];
export const roadCategory = ["road"];

function getRandomInt(max: number) {
  return Math.floor(Math.random() * max - 0.00001);
}

interface item {
  x: number;
  y: number;
  w: number;
  h: number;
}

export function sketchBuildings(w: number, h: number, n: number, front: number = 0) {
  let items = new Array<item>(0);
  let start = 5;
  let base_width = 30;
  let rand_width = 15 + (front * 2);
  let base_height = 30;
  let ceil_height = 55 + (front * 10);
  let gap = 10;
  let sy = 10;
  for (var i = 0; i < n; i++) {
    let sw = getRandomInt(rand_width) + base_width;
    let end = start + sw + getRandomInt(gap);
    if (end > w) {
      if (end - start > base_width) {
        sw = end - start;
      } else {
        break;
      }
    }
    let height_ext = getRandomInt(ceil_height) + base_height;
    if (height_ext > 90) { height_ext = 90; };
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

export function drawBuildings(
  drawer: Drawer,
  canvan: HTMLCanvasElement,
  sprite: Sprite,
  width: number,
  height: number,
  sx: number,
  sy: number,
  gray: number,
  style: string) {
  let ctx = canvan.getContext("2d")!;
  let idx = getRandomInt(sprite.getClip(style).length);
  let image = sprite.getFrame(style, idx);
  let w = image.width;
  let h = image.height;
  ctx.clearRect(0, 0, w, h);
  ctx.drawImage(image, 0, 0, w, h);
  let pixels = ctx.getImageData(0, 0, w, h);
  for (var x = 0; x < width; x++) {
    for (var y = 0; y < height; y++) {
      let yy = Math.floor(y * h / height);
      let xx = Math.floor(x * w / width);
      let idx = (yy * w + xx) * 4;
      let r = pixels.data[idx];
      let g = pixels.data[idx + 1];
      let b = pixels.data[idx + 2];
      let a = pixels.data[idx + 3];
      let dyeidx = 0;
      if (a != 0) {
        dyeidx = findGrayColor(r, g, b);
        drawer.setPixelByCor(sx + x, sy + height - y - 1, dyeidx + gray);
      }
      //drawer.setPixelByCor(sx+x, sy+height-y, 18);\
    }
  }
}

function drawImageAt(
  drawer: Drawer,
  sx: number,
  sy: number,
  width: number,
  height: number,
  ctx: CanvasRenderingContext2D,
  image: HTMLImageElement,
) {
  let w = image.width;
  let h = image.height;
  ctx.clearRect(0, 0, w, h);
  ctx.drawImage(image, 0, 0, w, h);
  let pixels = ctx.getImageData(0, 0, w, h);
  for (var x = 0; x < width; x++) {
    for (var y = 0; y < height; y++) {
      let yy = Math.floor(y * h / height);
      let xx = Math.floor(x * w / width);
      let idx = (yy * w + xx) * 4;
      let r = pixels.data[idx];
      let g = pixels.data[idx + 1];
      let b = pixels.data[idx + 2];
      let a = pixels.data[idx + 3];
      let dyeidx = 0;
      if (a != 0) {
        dyeidx = findGrayColor(r, g, b);
        drawer.setPixelByCor(sx + x, sy + height - y - 1, dyeidx);
      }
      //drawer.setPixelByCor(sx+x, sy+height-y, 18);\
    }
  }
}

export function drawRoad(
  drawer: Drawer,
  sprite: Sprite,
  canvan: HTMLCanvasElement,
  road: string,
) {
  for (var i = 0; i < 5; i++) { // we got 5 block of roads to generate
    let ctx = canvan.getContext("2d")!;
    let idx = getRandomInt(sprite.getClip(road).length);
    let image = sprite.getFrame(road, idx);
    drawImageAt(drawer, i * 50, 0, image.width, image.height, ctx, image);
  }
}