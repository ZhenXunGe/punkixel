import { costOfDyeIndex, Dye, DyeIndex, IsNillDye, pphOfDyeIndex } from "./palette";
import { drawBuildings, sketchBuildings, drawRoad } from "../sketch/sketch";
import { Sprite } from "../sprite/sprite";

/* Size of the individual home */
export const individualWidth:number = 250;
export const individualHeight:number = 100;
export const content_size:number = individualWidth * individualHeight;


/* Three layers for each individual home */
const sketchLayer = 0;
const frontLayer = 1;
const minionLayer = 2;


interface Delta {
  index: number;
  old: DyeIndex;
  new: DyeIndex;
}


export function getCorIndex(x:number, y:number) {
  return (y + x * individualHeight);
}

export function ofCorIndex(idx: number) {
  const y = idx % individualHeight;
  const x = (idx - idx % individualHeight) / individualHeight;
  return [x,y]
}

export type Painter = (x:number, y:number, c:number, alpha:number) => void

export class Drawer {
    pixels: Array<Array<DyeIndex>>;
    delta: Array<Delta>;
    cursor: () => number;
    offset: number;
    dry: boolean;
    constructor(
        pixels: Array<Array<DyeIndex>>,
        offset:number,
        cursor:()=>number,
        dry:boolean = true
        ) {
      this.offset = offset;
      this.cursor = cursor;
      this.dry = dry;
      this.pixels = pixels;
      this.delta = new Array(0);
    }

    paintPixel (paint:Painter, index: number, pos: number = 0) {
      let cursor = this.cursor();
      if (pos !== 0) {
        cursor = pos;
      }
      if(this.dry) {
        return;
      }
      const [x, y] = ofCorIndex(index);
      var dye = this.pixels[minionLayer][index];
      for (var i=2;i>=0;i--) {
        if (IsNillDye(dye)) {
          dye = this.pixels[i][index];
        }
      }
      if (!IsNillDye(dye)) {
        paint(x + this.offset - cursor, y, dye, 255);
      } else {
        paint(x + this.offset - cursor, y, (x + y) %2, 10);
      }
    }


    setDry(dry: boolean) {
      this.dry = dry;
    }

    setPixel(idx: number, dye:DyeIndex, layer=frontLayer) {
      this.pixels[layer][idx] = dye;
    }

    getPixel(idx:number) {
      return this.pixels[frontLayer][idx];
    }

    pushPixelDelta(idx: number, dye:DyeIndex) {
      let old_pph = pphOfDyeIndex(this.getPixel(idx));
      this.delta.push({
        index: idx,
        old: this.getPixel(idx),
        new: dye,
      });
      this.setPixel(idx, dye);
      let cost = costOfDyeIndex(dye);
      return [pphOfDyeIndex(dye) - old_pph, cost];
    }

    popPixelDelta(idx: number, dye:Dye) {
      if (this.delta.length > 0) {
        const ele = this.delta.pop();
        this.setPixel(ele!.index, ele!.old);
      };
    }

    draw(paint: Painter, pos:number=0) {
      for (var i=0; i<2; i++) {
        for (var idx=0; idx<content_size; idx++) {
          this.paintPixel(paint, idx, pos);
        }
      }
    }

    drawPolygon(layer:number, dye:DyeIndex,  x:number, y:number, h:number, w:number) {
      for (var i=0; i<w; i++) {
        let idtop = getCorIndex(x+i, y);
        let idbottom = getCorIndex(x+i, y+h-1);
        this.setPixel(idtop, dye);
        this.setPixel(idbottom, dye);
        for (var j=1; j<h-1; j++) {
          let id = getCorIndex(x+i, y+j);
          this.setPixel(id, 0);
        }
      }
      for (var j=1; j<h-1; j++) {
        let idleft = getCorIndex(x, y+j);
        let idright = getCorIndex(x+w-1, y+j);
        this.setPixel(idleft, dye);
        this.setPixel(idright, dye);
      }
    }

    setBackgroundPixelByCor(x:number, y:number, dye:DyeIndex) {
      let id = getCorIndex(x,y);
      this.setPixel(id, dye, sketchLayer);
    }

    resetSketch() {
      for (var i=0; i<content_size; i++) {
        this.setPixel(i, 0, sketchLayer);
      }
    }

    sketchWithStyle(canvas:HTMLCanvasElement, template:Sprite, main:string, road: string) {
      this.resetSketch();

      let items_front = sketchBuildings(individualWidth, individualHeight, 30, 1);
      let items_back = sketchBuildings(individualWidth, individualHeight, 30,0);
      for (var item of items_back) {
        drawBuildings(this, canvas, template, item.w, item.h, item.x, item.y, -2, main);
      }
      for (var item of items_front) {
        drawBuildings(this, canvas, template, item.w, item.h, item.x, item.y, 0,  main+"front");
      }
      drawRoad(this, template, canvas, road);
    }
}
