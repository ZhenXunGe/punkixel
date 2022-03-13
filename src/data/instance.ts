import { Minion, randomMinion } from "./minion";
import { DyeIndex } from "./palette";
import { content_size, Drawer, individualHeight, individualWidth, Painter } from "./draw";
import getWorld, { World } from "./world";
import { MinionSelector } from "../components/Inventory";

export interface InstanceInfo {
    id: string;
    content: Array<Array<DyeIndex>>;
    background: number;
    minions: Array<string>;
    drops: Array<number>;
    owner: string;
    ratio: number;
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
    addMinion(m: string) {
      this.info.minions.push(m);
    }
    calculateRewards(punkxiels:number, drops:string[]) {
      let share = this.info.ratio * punkxiels;
      let total_contribution = 0;
      for (var x of this.info.minions) {
        let minion = getWorld().getMinion(x);
        total_contribution += minion.contribution;
      };
      for (var m of this.info.minions) {
        let minion = getWorld().getMinion(m);
        let owner = minion.owner;
        getWorld().claimRewardPunkxiel(owner, Math.floor(share * minion.contribution / total_contribution));
      }
      for (var m of this.info.minions) {
        getWorld().clearMinionContribute(m);
      }
    }
  }
  
  export function EmptyInstance(id: string, world:World): InstanceInfo {
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
    let instance = {
      content: content,
      minions: [randomMinion("other", world).id, randomMinion("other", world).id, randomMinion("other", world).id],
      drops:[],
      id:id,
      ratio:0.4,
      owner:"other",
      background: 0
    };
    return instance;
  }
  
