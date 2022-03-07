import { Dye, DyeIndex, IsNillDye } from "./palette";
import { sketch, sketchBuild } from "../sketch/sketch";
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

export type Painter = (x:number, y:number, c:number) => void

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
      for (var i=1;i>=0;i--) {
        if (IsNillDye(dye)) {
          dye = this.pixels[i][index];
        }
      }
      if (!IsNillDye(dye)) {
        paint(x + this.offset - cursor, y, dye);
      } else {
        paint(x + this.offset - cursor, y, (x + y) %2);
      }
    }


    setDry(dry: boolean) {
      this.dry = dry;
    }

    setPixel(idx: number, dye:DyeIndex) {
      this.pixels[frontLayer][idx] = dye;
    }

    getPixel(idx:number) {
      return this.pixels[frontLayer][idx];
    }

    pushPixelDelta(idx: number, dye:DyeIndex) {
      this.delta.push({
        index: idx,
        old: this.getPixel(idx),
        new: dye,
      });
      this.setPixel(idx, dye);
    }

    popPixelDelta(idx: number, dye:Dye) {
      if (this.delta.length > 0) {
        const ele = this.delta.pop();
        this.setPixel(ele!.index, ele!.old);
      };
    }

    draw(paint: Painter, pos:number=0) {
      //console.log("pos, offset", pos, this.offset);
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

    setPixelByCor(x:number, y:number, dye:DyeIndex) {
      let id = getCorIndex(x,y);
      this.setPixel(id, dye);
    }

    reset() {
      for (var i=0; i<content_size; i++) {
        this.setPixel(i, 0);
      }
    }
    resetSketch() {
      let items_front = sketch(individualWidth, individualHeight, 30);
      let items_back = sketch(individualWidth, individualHeight, 30);
      for (var item of items_front) {
        this.drawPolygon(sketchLayer, 1*16 + 6, item.x, item.y, item.h, item.w);
      }
      for (var item of items_back) {
        this.drawPolygon(sketchLayer, 1*16 + 6, item.x, item.y, item.h, item.w);
      }
    }
    sketchWithStyle(canvas:HTMLCanvasElement, template:Sprite) {
      for (var i=0; i<content_size; i++) {
        this.setPixel(i, 0);
      }

      let items_front2 = sketch(individualWidth, individualHeight, 30, 1);
      let items_front = sketch(individualWidth, individualHeight, 30, 2);
      let items_back = sketch(individualWidth, individualHeight, 30,0);
      for (var item of items_back) {
        sketchBuild(this, canvas, template, item.w, item.h, item.x, item.y, -4);
      }
      for (var item of items_front2) {
        sketchBuild(this, canvas, template, item.w, item.h, item.x, item.y, -2);
      }
      for (var item of items_front) {
        sketchBuild(this, canvas, template, item.w, item.h, item.x, item.y, 0);
      }
    }
}


