import { costOfDyeIndex, toDyeColor, IsNillDye, pphOfDyeIndex, dilationDistance } from "../server/palette";
import { Dye, DyeIndex } from "../server/types";
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

export type Painter = {
    paint: (x:number, y:number, c:number, alpha:number) => void;
    delta: (x:number, y:number, c:number, alpha:number) => void;
}

export interface DrawerBoardProp {
  ratio: number;
  offsetX: number;
  offsetY: number;
  canvasWidth: number;
  canvasHeight: number;
}

export function buildPainter(image: ImageData, props:DrawerBoardProp, timeClock: number) {
  let painter = (x:number, y:number, c:number, alpha:number) => {
    let xx = x - props.offsetX;
    let yy = y - props.offsetY;
    let sx = xx * props.ratio;
    let sy = yy * props.ratio;
    let color = toDyeColor(c, timeClock);
    for (var px=sx; px<sx+props.ratio; px++) {
      for (var py=sy; py<sy+props.ratio; py++) {
        if (py < props.canvasHeight && px < props.canvasWidth) {
          let index = ((props.canvasHeight - py) * props.canvasWidth + px) * 4;
            image.data[index] = color[0];
            image.data[index+1] = color[1];
            image.data[index+2] = color[2];
            image.data[index+3] = alpha;
        }
      }
    }
  };

  let delta = (x:number, y:number, c:number, alpha:number) => {
    let xx = x - props.offsetX;
    let yy = y - props.offsetY;
    let sx = xx * props.ratio;
    let sy = yy * props.ratio;
    let color = toDyeColor(c, timeClock);
    for (var px=sx; px<sx+props.ratio; px++) {
      for (var py=sy; py<sy+props.ratio; py++) {
        if (py < props.canvasHeight && px < props.canvasWidth) {
          let index = ((props.canvasHeight - py) * props.canvasWidth + px) * 4;
            image.data[index] += Math.ceil(color[0] * alpha);
            image.data[index+1] += Math.ceil(color[1] * alpha);
            image.data[index+2] += Math.ceil(color[2] * alpha);
            //image.data[index+3] = 255;
        }
      }
    }
  };
  return {paint: painter, delta: delta};

}


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
      if (dye && !IsNillDye(dye)) {
        paint.paint(x + this.offset - cursor, y, dye, 255);
      } else {
        paint.paint(x + this.offset - cursor, y, (x + y) %2, 10);
      }
    }

    deltaPixel (paint:Painter, index: number, pos: number = 0) {
      let cursor = this.cursor();
      if (pos !== 0) {
        cursor = pos;
      }
      if(this.dry) {
        return;
      }
      const [x, y] = ofCorIndex(index);
      var dye = this.pixels[frontLayer][index];
      if (dye && !IsNillDye(dye) && dilationDistance(dye)>0) {
        let d = dilationDistance(dye);
        for(var xx = x-d; xx <= x+d; xx++) {
          let xd = Math.abs(x-xx);
          for(var yy = Math.ceil(y-Math.sqrt(d*d-xd*xd)); yy <= Math.floor(y+Math.sqrt(d*d-xd*xd)); yy++) {
            let yd = Math.abs(y-yy);
            let dis = Math.sqrt(xd*xd + yd*yd);
            if (xx>0 && xx<individualWidth && yy>0 && yy<individualHeight) {
                paint.delta(xx + this.offset - cursor, yy, dye, 1/dis);
            }
          }
        }
        /* Dilation effect */
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
      let d = dilationDistance(dye);
      console.log("dilation", d, dye);
      return [pphOfDyeIndex(dye) - old_pph, cost];
    }

    popPixelDelta(idx: number, dye:Dye) {
      if (this.delta.length > 0) {
        const ele = this.delta.pop();
        this.setPixel(ele!.index, ele!.old);
      };
    }

    encodeDelta() {
      let update = [];
      for (var p of this.delta) {
        update.push({index: p.index, dye: p.new});
      }
      return update;
    }

    draw(paint: Painter, pos:number=0) {
      for (var idx=0; idx<content_size; idx++) {
        this.paintPixel(paint, idx, pos);
      }
      for (var idx=0; idx<content_size; idx++) {
        this.deltaPixel(paint, idx, pos);
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
