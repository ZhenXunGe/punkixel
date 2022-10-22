import { Drawer, Painter } from "./draw";
import { Instance } from "./instance";
import { Player, Alien, Minion, InstanceInfo} from "../server/types";
import { punkixelEndpoint } from "./endpoint";
import background from "../images/sky.jpg";
import { DynamicState } from "../../server/simulate";
import { individualWidth, individualHeight } from "../server/types";
import { compressContent } from "../server/palette";

interface SimulateState {
  dynamicState: DynamicState
}

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
  syncTimestamp: number;
  constructor(cor: number) {
    this.cursor = cor;
    this.minions = new Map<string, Minion>();
    this.players = new Map<string, Player>();
    this.aliens = new Map<string, Alien>();
    this.instances = [];
    this.weather = "normal";
    this.timestamp = 0; //new Date().getMilliseconds();
    this.syncTimestamp = 0;
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
  rend(painter: Painter, p_start: number, span: number, cursor: number) {
    //console.log("start:", p_start, "end", p_end,"pos", cursor);
    var start = p_start;
    var ins = null;
    console.log("render ...");
    var c = cursor;
    for (var i = 0; i < span; i++) {
      start = p_start + i;
      if (start >= 0 && start < this.instances.length) {
        ins = this.getInstanceByIndex(start);
      }
      if (start<0) {
        ins = this.getInstanceByIndex(start+this.instances.length);
        c = cursor + this.instances.length * individualWidth;
      }
      if (start>=this.instances.length) {
        ins = this.getInstanceByIndex(start-this.instances.length);
        c = cursor - this.instances.length * individualWidth;
      }
      ins!.setDry(false);
      console.log("offset", ins!.drawer.offset - c, ins!.info.index);
      ins!.drawer.draw(painter, c);
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

  updatePlayer(p: Player) {
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

  updateInstance(instance: InstanceInfo) {
    if (this.instances.length <= instance.index) {
        this.instances[instance.index] = BuildInstance(instance, ()=>{return this.cursor;});
    }
  }

  updateMinion(minion: Minion) {
     this.minions.set(minion.id, minion);
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
  async placeMinion(mId: string, viewIndex: number) {
    let minion: Minion = await punkixelEndpoint.invokeRequest("POST", `minion/protect/`, JSON.parse(`{"minionid":"${mId}", "location":${viewIndex}}`));
    let m = this.minions.get(mId)!;
    this.minions.set(m.id, minion);
  }

  async unlockMinion(owner: string, index: number):Promise<Minion> {
    let player:Player = await punkixelEndpoint.invokeRequest("POST", `unlock/${owner}/${index}`, null);
    let minionId = player.inventory[index];
    let minion:Minion = await punkixelEndpoint.invokeRequest("GET", `minion/${minionId}`, null);
    this.registerMinion(minion);
    console.log("unlockMinion, owner is:", owner);
    this.players.set(player.id, player);
    return minion;
  }

  async rerollMinion(owner: string, index: number):Promise<Minion> {
    let minion:Minion = await punkixelEndpoint.invokeRequest("POST", `reroll/${owner}/${index}`, null);
    this.updateMinion(minion);
    console.log("rerollMinion, owner is:", owner);
    return minion;
  }

  async drawInstance(owner: string, instance: InstanceInfo) {
    let content = compressContent(instance.content);
    console.log("draw instance:", content);
    await punkixelEndpoint.invokeRequest("POST", `draw/${instance.index}/`, JSON.parse(JSON.stringify({
        content: content
    })));
    console.log("syn instance content done!");
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
    let instances = world.instances;
    let instanceInfos:Array<InstanceRank> = [];
    for (var i=0;i<instances.length;i++) {
      instanceInfos.push({
        owner: instances[i].info.owner,
        reward: instances[i].info.reward,
        pph: instances[i].info.pph,
      });
    }
    instanceInfos.sort((a, b) => {
      return (b.reward - a.reward);
    });
    console.log("rank:", instances);

    return {current:0, instances:instanceInfos.slice(0,6)}
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
      let l = players.length;
      let player = await punkixelEndpoint.invokeRequest("POST", "player/register", JSON.parse(`{"playerid":"${account}"}`));
      // Reload instances since new user available
      instances = await punkixelEndpoint.invokeRequest("GET", "instances", null);
      world.registerPlayer(player);
    }
    console.log("player:", player);
    for (var minion of minions) {
      world.registerMinion(minion);
    }
    world.loadInstance(BuildInstances(instances, () => { return world.cursor }));
    let info: SimulateState = await punkixelEndpoint.invokeRequest("GET", `info/${account}/0`, null);
    world.timestamp = info.dynamicState.timeClock;
    console.log("world initialized at simulate stamp:", world.timestamp);
    return 1;
  } catch (e) {
    console.log(e);
    return 0;
  }
}


/* Testging purpose for standalone version */

function BuildInstance(
  instance: InstanceInfo,
  cursor: () => number,
) {
  let d = new Drawer(instance.content, instance.index * individualWidth, cursor);
  return new Instance(d, instance);
}

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

