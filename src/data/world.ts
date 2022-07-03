import { Drawer, individualWidth, Painter } from "./draw";
import { EmptyInstance, Instance } from "./instance";
import { Minion, randomMinion } from "./minion";
import { Player } from "./player";
import { basic_palettes, ColorCategory, fromDrop, getPalette, liquid_blue_palette, liquid_green_palette, amber_dilation_palette, lightblue_dilation_palette, red_dilation_palette, pink_dilation_palette } from "./palette";
import background from "../images/sky.jpg";

export function getBackground(index: number) {
  let backs = [background];
  return backs[index];
}

const axios = require('axios').default;

export class RestEndpoint {
  constructor(public endpoint: string, public username: string, public useraddress: string) { };
  async prepareRequest(method: "GET" | "POST", url: string, body: JSON | null) {
    if (method === 'GET') {
      console.log(this.endpoint + url);
      try {
        let response = await axios.get(this.endpoint + url, body ? { params: body! } : {});
        return response.data;
      } catch (e: any) {
        console.log(e);
        throw Error("rest post failure");
      }
    } else {
      try {
        let response = await axios.post(this.endpoint + url, body ? body! : {});
        return response.data;
      } catch (e: any) {
        console.log(e);
        throw Error("rest post failure");
      }
    }
  }

  async getJSONResponse(json: any) {
    if (json["success"] !== true) {
      console.log(json);
      throw new Error("Request response error:" + json["error"]);
    }
    return json["result"];
  }

  async invokeRequest(method: "GET"|"POST", url: string, body: JSON | null) {
    let response = await this.prepareRequest(method, url, body);
    return await this.getJSONResponse(response);
  }
}

const punkixelEndpoint = new RestEndpoint("http://47.242.199.74:4000", "punkixel", "punkixel");


export class World {
  cursor: number;
  weather: string;
  instances: Array<Instance>;
  minions: Map<string, Minion>;
  players: Map<string, Player>;
  timestamp: number;
  constructor(cor: number) {
    this.cursor = cor;
    this.minions = new Map<string, Minion>();
    this.players = new Map<string, Player>();
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
  loadInstance () {
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

  unlockMinion(minion: Minion, index: number) {
    let owner = minion.owner;
    let player = this.players.get(owner)!;
    let inventory = [...player.inventory];
    inventory[index] = minion.id;
    let update = { ...player, inventory: inventory };
    this.players.set(player.id, update);
  }

  rerollMinion(minion: Minion, index: number) {
    let minionNew = randomMinion(minion.owner, getWorld());
    let owner = minion.owner;
    let player = this.players.get(owner)!;
    let inventory = [...player.inventory];
    inventory[index] = minionNew.id;
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

const world = new World(0);

export function getWorld() {
  return world;
}

export async function initializeWorld(local:boolean) {
  try {
    let test = await punkixelEndpoint.invokeRequest("GET", "world", null);
  } catch (e) {
    console.log(e);
    console.log("can not connect to the server, we are in offlane testing mode");
    world.loadInstance();
    let player = {
      id: "solo",
      energy: 50,
      punkxiel: 10000,
      ranking: 99,
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
      },
      {
        name: "dilation",
        palettes:
          [lightblue_dilation_palette, red_dilation_palette, pink_dilation_palette, amber_dilation_palette],
      }
      ],
      inventory: [randomMinion("solo", world).id, randomMinion("solo", world).id, null, null, null],
      homeIndex: 1,
    };
    world.registerPlayer(player);
    return 1;
  }
  return 0;
}


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

