import { Dye, basic, DyeIndex, ofDyeIndex, IsNillDye } from "./palette";
import { Minion, randomMinion } from "./minion";
import { sketch } from "./sketch";

/* Size of the individual home */
export const individualWidth:number = 225;
export const individualHeight:number = 100;
const content_size:number = individualWidth * individualHeight;


/* Three layers for each individual home */
const sketchLayer = 0;
const frontLayer = 1;
const minionLayer = 2;


export interface InstanceInfo {
  id: string;
  content: Array<Array<DyeIndex>>;
  minions: Array<Minion>;
  drops: Array<number>;
}

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

    resetSketch() {
      for (var i=0; i<content_size; i++) {
        this.setPixel(i, 0);
      }
      let items_front = sketch(individualWidth, individualHeight, 30);
      let items_back = sketch(individualWidth, individualHeight, 30);
      for (var item of items_front) {
        this.drawPolygon(sketchLayer, 1*16 + 2, item.x, item.y, item.h, item.w);
      }
      for (var item of items_back) {
        this.drawPolygon(sketchLayer, 1*16 + 2, item.x, item.y, item.h, item.w);
      }
    }
}


export class Instance {
  drawer: Drawer;
  info: InstanceInfo;
  constructor(drawer: Drawer, info: InstanceInfo) {
    this.drawer = drawer;
    this.info = info;
  }
  setDry(d: boolean) {
    this.drawer.setDry(d);
  }
  addMinion(m: Minion) {
    this.info.minions.push(m);
  }
}

export function EmptyInstance(id: string) {
  let content = [
    new Array(individualHeight * individualWidth),
    new Array(individualHeight * individualWidth),
    new Array(individualHeight * individualWidth)
  ];
  for (var i=0; i<content_size; i++) {
      content[0][i] = 0;
      content[1][i] = 0;
      content[2][i] = 0;
  }
  let instance = {content: content, minions: [randomMinion(), randomMinion(), randomMinion()], drops:[], id:id};
  return instance;
}

function BuildTestInstances(
    cursor: () => number,
    ) {
  let instance_list = new Array<Instance>();
  for (var i=0; i<5; i++) {
    let instance = EmptyInstance(`instance_${i}`);
    let d = new Drawer(instance.content, i*individualWidth, cursor);
    d.resetSketch();
    instance_list.push(new Instance(d, instance));
  }
  return instance_list;
}

export class World {
  cursor: number;
  instances: Array<Instance>;
  constructor(cor: number) {
    var that = this;
    this.cursor = cor;
    this.instances = BuildTestInstances(()=>{return that.cursor});
  }
  getInstance(center_position: number) {
    return this.instances[Math.floor(center_position / individualWidth)];
  }
  getInstanceById(id: number) {
    return this.instances[id];
  }
  rend(painter: Painter, pos: number) {
    let center = Math.floor(pos/individualWidth);
    let p_start = center - 3;
    let p_end = center + 3;
    console.log("start:", p_start, "end", p_end);
    for (var i=p_start; i<=p_end; i++) {
      if (i>=0 && i<this.instances.length) {
        let ins = this.getInstance(i*individualWidth);
        ins.setDry(false);
        ins.drawer.draw(painter);
      }
    }
    let center2 = Math.floor(this.cursor/individualWidth);
    let p_start2 = center2 - 3;
    let p_end2 = center2 + 3;

    for (var j=p_start2; j<=p_end2; j++) {
      if (j>=0 && j<this.instances.length) {
        if (j<p_start || j>p_end) {
          this.getInstance(j).setDry(true);
        }
      }
    }
    this.cursor = pos;
  }
}
