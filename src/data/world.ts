import { content_size, Drawer, individualHeight, individualWidth, Painter } from "./draw";
import { EmptyInstance, Instance } from "./instance";
import { Minion, randomMinion } from "./minion";
import { ColorCategory } from "./palette";
import background from "./back.jpg";

export function getBackground(index: number) {
  let backs = [background];
  return backs[index];
}


export interface Player {
  id: string;
  energy: number;
  punkxiel: number;
  ranking: number;
  pph: number;
  voucher: number;
  reward: number;
  palettes: Array<ColorCategory>;
  homeIndex: number;
  inventory: Array<string | null>;
}

export class World {
  cursor: number;
  instances: Array<Instance>;
  minions: Map<string, Minion>;
  players: Map<string, Player>;
  constructor(cor: number) {
    var that = this;
    this.cursor = cor;
    this.minions = new Map<string, Minion>();
    this.players = new Map<string, Player>();
    this.instances = [];
  }
  getInstance(center_position: number) {
    return this.instances[Math.floor(center_position / individualWidth)];
  }
  getInstanceById(id: number) {
    return this.instances[id];
  }
  loadInstance() {
    this.instances = BuildTestInstances(() => { return this.cursor });
  }
  rend(painter: Painter, pos: number) {
    let center = Math.floor(pos / individualWidth);
    let p_start = center - 3;
    let p_end = center + 3;
    console.log("start:", p_start, "end", p_end);
    for (var i = p_start; i <= p_end; i++) {
      if (i >= 0 && i < this.instances.length) {
        let ins = this.getInstance(i * individualWidth);
        ins.setDry(false);
        ins.drawer.draw(painter);
      }
    }
    let center2 = Math.floor(this.cursor / individualWidth);
    let p_start2 = center2 - 3;
    let p_end2 = center2 + 3;

    for (var j = p_start2; j <= p_end2; j++) {
      if (j >= 0 && j < this.instances.length) {
        if (j < p_start || j > p_end) {
          this.getInstance(j).setDry(true);
        }
      }
    }
    this.cursor = pos;
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
  getMinion(id: string) :Minion {
    return this.minions.get(id)!;
  }

  /* Each time a bullet hit alien, the contribution of the owner of the bullet is increased */
  incMinionContribute(id: string, power:number){
    let m = this.minions.get(id)!;
    let n = {...m, contribution: m.contribution + power};
    this.minions.set(m.id, n);
  }

  clearMinionContribute(id: string) {
    let m = this.minions.get(id)!;
    let n = {...m, contribution: 0};
    this.minions.set(m.id, n);
  }

  /* Place a minion in certain block. 
   * This operation will clear the contribution of the minion in its current block.
   */
  placeMinion(mId: string, viewIndex: number) {
    let m = this.minions.get(mId)!;
    let n = {...m, location: viewIndex, contribution: 0};
    this.minions.set(m.id, n);
  }

  unlockMinion(owner: string, index: number) {
    let r = randomMinion(owner, this);
    let player = this.players.get(owner)!;
    let inventory = [...player.inventory];
    inventory[index] = r.id;
    let update = {...player, inventory: inventory};
    this.players.set(player.id, update);
  }

  claimRewardPunkxiel(owner: string, reward: number) {
    if (owner == "solo") {
      let player = this.players.get(owner)!;
      console.log("updating rewords....");
      let update = {...player, punkxiel: player.punkxiel + reward};
      this.players.set(player.id, update);
    }
  }
}

export default function getWorld() {
  return world;
}

const world = new World(0);
world.loadInstance();
let player =  {
  id: "solo",
  energy: 50,
  punkxiel: 1000,
  ranking: 9999,
  pph: 0,
  voucher: 1,
  palettes: [],
  reward: 0,
  inventory: [randomMinion("solo", world).id, randomMinion("solo",world).id, null, null, null],
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
    let d = new Drawer(instance.content, i * individualWidth, cursor);
    d.resetSketch();
    instance_list.push(new Instance(d, instance));
  }
  return instance_list;
}