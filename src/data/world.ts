import { content_size, Drawer, individualHeight, individualWidth, Painter } from "./draw";
import { Minion, randomMinion } from "./minion";
import { DyeIndex } from "./palette";


export interface InstanceInfo {
    id: string;
    content: Array<Array<DyeIndex>>;
    minions: Array<Minion>;
    drops: Array<number>;
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
    let instance = {content: content, minions: [randomMinion(1000), randomMinion(1000), randomMinion(1000)], drops:[], id:id};
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

const world = new World(0);

export default function getWorld() {
    return world;
}