import { Minion, randomMinion } from "./minion";
import { DyeIndex } from "./palette";
import { content_size, Drawer, individualHeight, individualWidth, Painter } from "./draw";

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
  
