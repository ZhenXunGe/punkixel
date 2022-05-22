import { content_size, Drawer, individualHeight, individualWidth, Painter } from "./draw";
import { EmptyInstance, Instance } from "./instance";
import { Minion, randomMinion } from "./minion";
import { basic_palettes, ColorCategory, fromDrop, getPalette, liquid_blue_palette, liquid_green_palette } from "./palette";
import background from "../images/sky.jpg";
import { textChangeRangeIsUnchanged } from "typescript";

export function getBackground(index: number) {
  let backs = [background];
  return backs[index];
}


export interface Player {
  id: string;
  energy: number;
  punkxiel: number;
  ranking: number;
  voucher: number;
  reward: number;
  palettes: Array<ColorCategory>;
  homeIndex: number;
  inventory: Array<string | null>;
}

export class World {
  cursor: number;
  weather: string;
  instances: Array<Instance>;
  minions: Map<string, Minion>;
  players: Map<string, Player>;
  sketched: boolean;
  timestamp: number;
  constructor(cor: number) {
    var that = this;
    this.cursor = cor;
    this.minions = new Map<string, Minion>();
    this.players = new Map<string, Player>();
    this.instances = [];
    this.weather = "normal";
    this.sketched = false;
    this.timestamp = new Date().getMilliseconds();
  }
  initSketch() {
    if (this.sketched === false) {
      this.sketched = true;
      return true;
    } else {
      return false;
    }
  }
  getInstance(center_position: number) {
    return this.instances[Math.floor(center_position / individualWidth)];
  }
  getInstanceByIndex(idx: number) {
    return this.instances[idx];
  }
  getInstanceById(id: string) {
    for (var ins of this.instances) {
      if (ins.info.id === id) {
        return ins;
      }
    }
    return undefined;
  }
  loadInstance() {
    this.instances = BuildTestInstances(() => { return this.cursor });
  }
  rend(painter: Painter, p_start: number, p_end: number, cursor: number) {
    //console.log("start:", p_start, "end", p_end,"pos", cursor);
    for (var i = p_start; i <= p_end; i++) {
      if (i >= 0 && i < this.instances.length) {
        let ins = this.getInstance(i * individualWidth);
        ins.setDry(false);
        ins.drawer.draw(painter, cursor);
      }
      if (i<0) {
        let ins = this.getInstanceByIndex(i+this.instances.length);
        ins.setDry(false);
        ins.drawer.draw(painter, cursor + this.instances.length * individualWidth);
      }
      if (i>=this.instances.length) {
        let ins = this.getInstanceByIndex(i-this.instances.length);
        ins.setDry(false);
        ins.drawer.draw(painter, cursor - this.instances.length * individualWidth);
      }
    }
  }

  flipWeather() {
    let w = ['rain', 'default', 'snow'];
    let r = w[Math.floor(Math.random() * 3)];
    this.weather = r;
  }

  registerPlayer(p: Player) {
    this.players.set(p.id, p);
  }

  getPlayer(pid: string) {
    return this.players.get(pid)!;
  }

  registerMinion(m: Minion) {
    this.minions.set(m.id, m);
  }
  getMinion(id: string): Minion {
    return this.minions.get(id)!;
  }

  /* Each time a bullet hit alien, the contribution of the owner of the bullet is increased */
  incMinionContribute(id: string, power: number) {
    let m = this.getMinion(id)!;
    let n = { ...m, contribution: m.contribution + power};
    this.minions.set(m.id, n);
  }

  clearMinionContribute(id: string) {
    console.log("clear contribute", id);
    let m = this.minions.get(id)!;
    let n = { ...m, contribution: 0 };
    this.minions.set(m.id, n);
  }

  /* Place a minion in certain block. 
   * This operation will clear the contribution of the minion in its current block.
   */
  placeMinion(mId: string, viewIndex: number) {
    let m = this.minions.get(mId)!;
    let n = { ...m, location: viewIndex, contribution: 0 };
    this.minions.set(m.id, n);
  }

  unlockMinion(owner: string, index: number) {
    let r = randomMinion(owner, this);
    let player = this.players.get(owner)!;
    let inventory = [...player.inventory];
    inventory[index] = r.id;
    let update = { ...player, inventory: inventory };
    this.players.set(player.id, update);
  }

  claimRewardPunkxiel(owner: string, reward: number) {
    if (owner == "solo") {
      let player = this.players.get(owner)!;
      console.log("updating rewords....");
      let update = { ...player, punkxiel: player.punkxiel + reward };
      this.players.set(player.id, update);
    }
  }

  claimDrop(owner: string, drops: Array<string>) {
    if (owner == "solo") {
      let player = this.players.get(owner)!;
      let palettes = [...player.palettes];
      for (var drop of drops) {
        let paletteIndex = fromDrop(drop);
        let palette = getPalette(fromDrop(drop));
        let category = (paletteIndex - paletteIndex % 16) / 16;
        let ps: ColorCategory = {
          ...palettes[category],
          palettes: [...palettes[category].palettes, palette]
        }
        palettes[category] = ps;
        console.log(`palette ${palette.name} added`);
      }
      let update = { ...player, palettes: palettes };
      this.players.set(player.id, update);
    }
  }

  spentPunkxiel(sender: string, cost: number) {
    console.log("spent punkxiel");
    if (sender == "solo") {
      let player = this.players.get(sender)!;
      let update = { ...player, punkxiel: player.punkxiel - cost };
      this.players.set(player.id, update);
    }
  }

  // claimDrop(owner: string, drops: Array<string>) {
  //   if (owner == "solo") {
  //     let player = this.players.get(owner)!;
  //     let palettes = [...player.palettes];
  //     for (var drop of drops) {
  //       let paletteIndex = fromDrop(drop);
  //       let palette = getPalette(fromDrop(drop));
  //       let category = (paletteIndex - paletteIndex % 16) / 16;
  //       let ps:ColorCategory = {
  //         ...palettes[category],
  //         palettes: [...palettes[category].palettes, palette]
  //       }
  //       palettes[category] = ps;
  //       console.log(`palette ${palette.name} added`);
  //     }
  //     let update = { ...player, palettes: palettes };
  //     this.players.set(player.id, update);
  //   }
  // }

  // spentPunkxiel(sender: string, cost:number) {
  //   if (sender == "solo") {
  //     let player = this.players.get(sender)!;
  //     console.log("updating rewords....");
  //     let update = {...player, punkxiel: player.punkxiel - cost};
  //     this.players.set(player.id, update);
  //   }
  // }
}

export default function getWorld() {
  return world;
}

const world = new World(0);
world.loadInstance();
let player = {
  id: "solo",
  energy: 50,
  punkxiel: 1000,
  ranking: 9999,
  pph: 0,
  voucher: 1,
  palettes: [{
    name: "basic",
    palettes: basic_palettes,
  },
  {
    name: "spin",
    palettes: [
      liquid_green_palette,
      liquid_blue_palette,]
  }],
  reward: 0,
  inventory: [randomMinion("solo", world).id, randomMinion("solo", world).id, null, null, null],
  homeIndex: 1,
};

world.registerPlayer(player);

/* Testging purpose for standalone version */



function BuildTestInstances(
  cursor: () => number,
) {
  let instance_list = new Array<Instance>();
  for (var i = 0; i < 5; i++) {
    let instance = EmptyInstance(`instance_${i}`, world);
    if (i == 1) {
      instance.owner = "solo";
    }
    let d = new Drawer(instance.content, i * individualWidth, cursor);
    instance_list.push(new Instance(d, instance));
  }
  return instance_list;
}

