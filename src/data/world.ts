import { Drawer, individualWidth, Painter } from "./draw";
import { Instance, InstanceInfo } from "./instance";
import { Player, Alien, Minion} from "../../server/types";
import { ColorCategory, fromDrop, getPalette } from "./palette";
import { punkixelEndpoint } from "./endpoint";
import background from "../images/sky.jpg";

export function getBackground(index: number) {
  let backs = [background];
  return backs[index];
}

interface InstanceRank {
  owner:string,
  pph:number,
  reward:number,
}

export interface RankInfo {
  instances: Array<InstanceRank>;
  current: number;
}

export class World {
  cursor: number;
  weather: string;
  instances: Array<Instance>;
  minions: Map<string, Minion>;
  players: Map<string, Player>;
  aliens: Map<string, Alien>;
  timestamp: number;
  constructor(cor: number) {
    this.cursor = cor;
    this.minions = new Map<string, Minion>();
    this.players = new Map<string, Player>();
    this.aliens = new Map<string, Alien>();
    this.instances = [];
    this.weather = "normal";
    this.timestamp = new Date().getMilliseconds();
  }

  getInstance(center_position: number) {
    return this.instances[Math.floor(center_position / individualWidth)];
  }
  getInstanceByIndex(idx: number) {
    return this.instances[idx];
  }
  updateInstancePPH(idx:number, delta:number) {
    this.instances[idx].info.pph += delta;
  }
  loadInstance (instances: Array<Instance>) {
    this.instances = instances;
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
    console.log("Register minion:", m.id, m);
  }
  getMinion(id: string): Minion {
    return this.minions.get(id)!;
  }

  registerAlien (a: Alien) {
    this.aliens.set(a.id, a);
    console.log("Register alien:", a.id, a);
  }
  getAlien(id: string): Alien{
    return this.aliens.get(id)!;
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

  unlockMinion(minion: Minion, index: number) {
    let owner = minion.owner;
    console.log("unlockMinion, owner is:", owner);
    let player = this.players.get(owner)!;
    let inventory = [...player.inventory];
    inventory[index] = minion.id;
    console.log("inventory is:", inventory);
    let update = { ...player, inventory: inventory };
    this.players.set(player.id, update);
  }

  rerollMinion(minion: Minion, index: number) {
    let owner = minion.owner;
    let player = this.players.get(owner)!;
    let inventory = [...player.inventory];
    inventory[index] = minion.id;
    let update = { ...player, inventory: inventory };
    this.players.set(player.id, update);
  }

  claimRewardPunkxiel(owner: string, reward: number) {
    let player = this.players.get(owner)!;
    let instance = this.getInstanceByIndex(player.homeIndex);
    let info = instance.info;
    console.log("updating rewords....");
    let update = { ...player, punkxiel: player.punkxiel + reward };
    this.players.set(player.id, update);
    info.reward += reward;
  }

  claimDrop(owner: string, drops: Array<string>) {
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

  spentPunkxiel(sender: string, cost: number) {
    let player = this.players.get(sender)!;
    let update = { ...player, punkxiel: player.punkxiel - cost };
    this.players.set(player.id, update);
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

  async getTopRank() :Promise<RankInfo> {
    let instances = world.instances.sort((a:Instance, b:Instance) => {
      return (a.info.reward - b.info.reward);
    });
    let instanceInfos:Array<InstanceRank> = [];
    for (var i=0;i<instances.length && i<=5;i++) {
      instanceInfos.push({
        owner: instances[i].info.owner,
        reward: instances[i].info.reward,
        pph: instances[i].info.pph,
      });
    }
    return {current:0, instances:instanceInfos}
  }

}

const world = new World(0);

export function getWorld() {
  return world;
}


/*
 * Testing code for initialize world
 *
 * */


export async function initializeWorld(account: string) {
  try {
    let instances:Array<InstanceInfo> = await punkixelEndpoint.invokeRequest("GET", "instances", null);
    let players = await punkixelEndpoint.invokeRequest("GET", "players", null);
    let minions = await punkixelEndpoint.invokeRequest("GET", "minions", null);
    for (var player of players) {
      world.registerPlayer(player);
    }
    let p = world.getPlayer(account);
    if (p == null) {
      world.registerPlayer(createTestPlayer(account, players.length));
      instances.push(EmptyInstance("temp-instance", world, account));
    }
    for (var minion of minions) {
      world.registerMinion(minion);
    }
    world.loadInstance(BuildInstances(instances, () => { return world.cursor }));
    return 1;
  } catch (e) {
    return 0;
  }
}


/* Testging purpose for standalone version */



function BuildInstances(
  instances: Array<InstanceInfo>,
  cursor: () => number,
) {
  let instance_list = new Array<Instance>();
  for (var i = 0; i < instances.length; i++) {
    let d = new Drawer(instances[i].content, i * individualWidth, cursor);
    instance_list.push(new Instance(d, instances[i]));
  }
  return instance_list;
}

