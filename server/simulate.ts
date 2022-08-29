import {Alien, BulletModifier, Minion, MinionType,
        InstanceInfo, SysEvent,
        rewardEvent, dropEvent,
        protectEvent,
} from "./types";
import {getMinion, getInstanceByIndex,
        incMinionContribute, clearMinionContribute,
        claimDrop, registerEvent, updateInstance,
        claimRewardPunkixel, loadWorld} from "./db";
import { pickRandomAlien, getPlayer } from "./db";
import { randomPalette, installPalette } from "./generator";
import { toPaletteIndex } from "./palette";

const individualWidth = 250;

const distance = (a: [number, number], b: [number, number]) => {
  let dx = a[0] - b[0];
  let dy = a[1] - b[1];
  return Math.sqrt((dx * dx) + (dy * dy));
}

export interface DynamicState {
    timeClock: number;
    alien: Alien;
    upcomingAlien: Alien;
    viewIndex: number;
    totalInstance: number;
    damage: number;
}

export async function createDynamicState(): Promise<DynamicState>{
    let alien = await pickRandomAlien();
    console.assert(alien!==null);
    let alienNext = await pickRandomAlien();
    console.assert(alienNext!==null);
    let world = await loadWorld();
    return {
        timeClock:0,
        alien: alien,
        upcomingAlien: alienNext,
        viewIndex:0,
        totalInstance: world.totalInstance,
        damage: 0,
    }
}


export interface BulletInfo {
  x: number;
  y: number;
  source: string;
  power: number;
  speed: number;
  modifier: BulletModifier;
  rotate: number;
  approach: (x: number, y: number) => boolean[];
}

export class StraightBullet implements BulletInfo {
  x: number;
  y: number;
  width: number;
  source: string;
  power: number;
  speed: number;
  rotate: number;
  bomb: 0;
  hit: boolean;
  modifier: BulletModifier;
  constructor(x: number, y: number, width: number, power: number, modifier: BulletModifier,
      speed: number, rotate: number, source: string) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.speed = speed;
    this.power = power;
    this.modifier = modifier;
    this.rotate = rotate;
    this.source = source;
    this.bomb = 0;
    this.hit = false;
  }
  getFront(): number[] {
    return [
      this.x + this.width * Math.cos(this.rotate * Math.PI / 180),
      this.y + this.width * Math.sin(this.rotate * Math.PI / 180)
    ];
  };
  getBack(): number[] {
    return [this.x, this.y];
  }
  approach(x: number, y: number): boolean[] {
    let r = this.rotate * Math.PI / 180;
    if (this.bomb < 4) {
      if (this.bomb > 0) {
        this.bomb++;
      } else if (this.y < 370) {
        let next_x = this.x + (Math.cos(r)) * this.speed;
        let next_y = this.y + (Math.sin(r)) * this.speed;
        // adjust omega
        this.x = next_x;
        this.y = next_y;
        let dis = distance([this.x, this.y], [x, y]);
        let ratio = 50 / dis;
        //throw("Exception ERRE");
        //console.log("ratio", ratio);
        if (ratio > 1) {
          this.hit = true;
          this.bomb++;
        }
      } else {
        this.bomb++;
      }
      return [false,false];
    } else {
      return [true, this.hit];
    }
  }
}


export class TrackBullet implements BulletInfo {
  x: number;
  y: number;
  width: number;
  source: string;
  power: number;
  speed: number;
  rotate: number;
  bomb: number;
  hit: boolean;
  modifier: BulletModifier;
  constructor(x: number, y: number, width: number, power: number, modifier: BulletModifier, speed: number, rotate: number, source: string) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.speed = speed;
    this.power = power;
    this.rotate = rotate;
    this.source = source;
    this.bomb = 0;
    this.hit = false;
    this.modifier = modifier;
  }
  getFront(): number[] {
    return [
      this.x + this.width * Math.cos(this.rotate * Math.PI / 180),
      this.y + this.width * Math.sin(this.rotate * Math.PI / 180)
    ];
  };
  getBack(): number[] {
    return [this.x, this.y];
  }
  approach(x: number, y: number): boolean[] {
    if (this.bomb == 0) {
      if (this.y < 370) {
        let r = this.rotate * Math.PI / 180;
        let next_x = this.x + (Math.cos(r)) * this.speed;
        let next_y = this.y + (Math.sin(r)) * this.speed;
        this.speed += 1;
        // adjust omega
        this.x = next_x;
        this.y = next_y;
        let ratio = this.width / distance([this.x, this.y], [x, y]);
        //let aim_x = (x - this.x) * ratio + this.x;
        //let aim_y = (y - this.y) * ratio + this.y;
        let omega = Math.atan2(y - this.y, x - this.x) * 180 / Math.PI;
        if (Math.abs(omega - this.rotate) > 10) {
          this.rotate = this.rotate + 5 * Math.sign(omega - this.rotate);
        } else {
          this.rotate = omega;
        }
        //throw("Exception ERRE");
        if (ratio > 1) {
          this.hit = true;
          this.bomb++;
        }
        return [false, false];
      } else {
        this.bomb++;
        return [false, false];
      }
    } else if (this.bomb < 4) {
      this.bomb++;
      return [false, false];
    } else {
      return [true, this.hit];
    }
  }

}


export class BombBullet implements BulletInfo {
  x: number;
  y: number;
  width: number;
  source: string;
  power: number;
  speed: number;
  rotate: number;
  bomb: 0;
  hit: boolean;
  modifier: BulletModifier;
  constructor(x: number, y: number, width: number, power: number, modifier: BulletModifier,
      speed: number, rotate: number, source: string) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.speed = speed;
    this.power = power;
    this.modifier = modifier;
    this.rotate = rotate;
    this.source = source;
    this.bomb = 0;
    this.hit = false;
  }
  getFront(): number[] {
    return [
      this.x + this.width * Math.cos(this.rotate * Math.PI / 180),
      this.y + this.width * Math.sin(this.rotate * Math.PI / 180)
    ];
  };
  getBack(): number[] {
    return [this.x, this.y];
  }
  approach(x: number, y: number): boolean[] {
    let r = this.rotate * Math.PI / 180;
    if (this.bomb < 4) {
      if (this.bomb > 0) {
        this.bomb++;
      } else if (this.y < 370) {
        let next_x = this.x + (Math.cos(r)) * this.speed;
        let next_y = this.y + (Math.sin(r)) * this.speed;
        // adjust omega
        this.x = next_x;
        this.y = next_y;
        let dis = distance([this.x, this.y], [x, y]);
        let ratio = 50 / dis;
        //throw("Exception ERRE");
        //console.log("ratio", ratio);
        if (ratio > 1) {
          this.hit = true;
          this.bomb++;
        }
      } else {
        this.bomb++;
      }
      return [false,false];
    } else {
      return [true, this.hit];
    }
  }
}

export class DynamicMinion {
  minion: Minion;
  offsetX: number;
  offsetY: number;
  bulletPos: number[];
  countingdown: number;
  currentFrame: number;

  generateBulletPos(t:MinionType) {
    if(t==="ufo") {
      return [25,40];
    } else if (t==="land") {
      return [25,15];
    } else if (t==="airballoon") {
      return [25,35];
    } else {
      return [0,0];
    }
  }

  updateMinionPosition(targetX: number) {
    if (this.minion.type !== "land") {
        let m = this.minion;
        let pos_x = this.offsetX + m.x + (1 - Math.floor(Math.random() * 3)) * 5;
        if (pos_x < 0) { pos_x = 0; };
        if (pos_x > 900) { pos_x = 900; };
        this.offsetX = pos_x - m.x;
        this.currentFrame = Math.abs(this.offsetX % 2);
     } else {
        let m = this.minion;
        let pos_x = this.offsetX + m.x + (1 - Math.floor(Math.random() * 3)) * 5;
        if (pos_x < 0) { pos_x = 0; };
        if (pos_x > 900) { pos_x = 900; };
        this.offsetX = pos_x - m.x;
        let indexBase = pos_x > targetX ? 0 : 3
        this.currentFrame = Math.abs(this.offsetX%3) + indexBase;
     }
  }


  spawnBullet(alien_x:number, alien_y:number, offsetX:number, offsetY:number):BulletInfo {
    let start_x = this.minion.x + this.bulletPos[0] + offsetX;
    let start_y = this.minion.y + this.bulletPos[1] + offsetY;
    if (this.minion.modifier[0] == "missle") {
      let rotate = 0;
      if (this.minion.x > alien_x) {
        rotate = 180;
      }
      return new TrackBullet(start_x, start_y, 20, this.minion.power, this.minion.modifier[1], 0, rotate, this.minion.id);
    } else if (this.minion.modifier[0] == "bomb") {
      let rotate = Math.atan2(alien_y - this.minion.y, alien_x - this.minion.x)*180/Math.PI;
      return new BombBullet(start_x, start_y, 10, this.minion.power, this.minion.modifier[1], 20, rotate, this.minion.id);
    }
    return new StraightBullet(start_x, start_y, 20, this.minion.power, this.minion.modifier[1], 20, 0, this.minion.id);
  }

  constructor(minion: Minion) {
    this.minion = minion;
    this.offsetX = 0;
    this.offsetY = 0;
    this.currentFrame = 0;
    this.bulletPos = this.generateBulletPos(minion.type);
    this.countingdown = 2;
  }
}


class DynamicInfo {
  bullets: Array<BulletInfo> = [];
  minions: Array<DynamicMinion> = [];

  addBullet(d:BulletInfo) {
    this.bullets.push(d);
  };

  resetBullets(bullets: Array<BulletInfo>) {
    this.bullets = bullets;
  };

  allBullets() {
    return this.bullets;
  };

  bulletsInfo() {
    let info = "";
    for (var b of this.bullets) {
      info = info + `(${b.x}, ${b.y}),`;
    }
    return info;
  }

  async loadInstance(instance: InstanceInfo) {
    this.minions = [];
    console.log(`loading instance: ${instance.index}, ${instance.minions.length} minions avaiable`);
    for (var mid of instance.minions) {
      let minfo = await getMinion(mid);
      this.minions.push(new DynamicMinion(minfo));
    };
  }

  async addMinion(mid: string) {
    let minfo = await getMinion(mid);
    this.minions.push(new DynamicMinion(minfo));
  }

  getMinions() {
    return this.minions;
  }

}

export class Simulator {
  dynamicState: DynamicState;
  dynamicInfo: DynamicInfo;
  instance: InstanceInfo;

  constructor(state: DynamicState, instance:InstanceInfo) {
    this.dynamicState = state;
    this.dynamicInfo = new DynamicInfo();
    this.instance = instance;
  }

  info() {
    return {
      dynamicState: this.dynamicState,
      dynamicInfo: this.dynamicInfo,
      instance: this.instance,
    }
  }

  updateTotalInstance(nbInstance: number) {
    this.dynamicState.totalInstance = nbInstance;
  }

  addMinion(mid: string) {
    this.dynamicInfo.addMinion(mid)
  }

  async init() {
    await this.switchView(0);
  }

  async calculateRewards(instance:InstanceInfo, punkxiels:number, drops:string[]) {
    let share = instance.ratio * punkxiels;
    let total_contribution = 0;
    let rewards = [];
    for (var x of instance.minions) {
      let minion = await getMinion(x);
      total_contribution += minion.contribution;
    };
    for (var m of instance.minions) {
      let minion = await getMinion(m);
      let owner = minion.owner;
      let amount = Math.floor(share * minion.contribution / total_contribution);
      await claimRewardPunkixel(owner, amount);
      rewards.push({minion: minion, amount:amount});
    }
    for (var m of instance.minions) {
      await clearMinionContribute(m);
    }
    let reserve = Math.floor((1 - instance.ratio) * punkxiels);
    let locOwner = instance.owner;
    claimDrop(locOwner, reserve, drops);
    instance.reward += punkxiels;
    await updateInstance(instance);
    return {
      rewards: rewards,
      reserve: reserve,
    };
  }

  async signalBulletsUpdate(alienPos: Array<number>) {
    let cs = [];
    let bullets = this.dynamicInfo.allBullets();
    for (var i=0;i<bullets.length;i++) {
      let b = bullets[i];
      let [done, hit] = b.approach(alienPos[0], alienPos[1]);
      if (hit) {
        console.log("hit at:", alienPos[0], alienPos[1]);
        incMinionContribute(b.source, b.power);
        this.dynamicState.damage += b.power;
        if (this.dynamicState.damage > 200) {
          this.dynamicState.alien.status = "dizzle";
          this.dynamicState.alien.dizzle = 12;
          this.dynamicState.damage = 0;
          let instance = await getInstanceByIndex(this.dynamicState.viewIndex);
          let rewardinfo = await this.calculateRewards(instance, 100, this.dynamicState.alien.drop);
          registerEvent(rewardEvent(this.dynamicState.alien.id, instance, rewardinfo));
          let [cidx, pidx] = randomPalette();
          let player = await getPlayer(instance.owner);
          installPalette(player, cidx, pidx);
          registerEvent(dropEvent(this.dynamicState.alien.id, instance, toPaletteIndex(cidx, pidx)));
        }
      }
      if (!done) {
        cs.push(b);
      }
    }
    this.dynamicInfo.resetBullets(cs);
  };
  async signalAlien() {
    let status = this.dynamicState.alien.status;
    if (status == "run") {
      this.dynamicState.alien.pos += 1;
      if (this.dynamicState.alien.pos >= individualWidth * this.dynamicState.totalInstance) {
        this.dynamicState.alien = this.dynamicState.upcomingAlien;
        this.dynamicState.upcomingAlien = await pickRandomAlien();
      }
    }
    if (status == "dizzle") {
      this.dynamicState.alien.dizzle -= 1;
      if (this.dynamicState.alien.dizzle == 0) {
        this.dynamicState.alien.status = "run";
      }
    }
  }
  async switchView(index: number) {
      this.dynamicState.viewIndex = index;
      console.log("switch view:", index);
      let instance = await getInstanceByIndex(this.dynamicState.viewIndex);
      this.instance = instance;
      await this.dynamicInfo.loadInstance(instance);
      if(index === 0) {
        this.dynamicState.alien.pos = 0;
      }
      console.log("minions:", this.dynamicInfo.minions.length);
      //getWorld().flipWeather();
  }

  async step() {
    let ratio = 4;
    let dynamic = this.dynamicInfo;
    let minions = dynamic.getMinions();
    let alien = this.dynamicState.alien;
    let pos = (alien.pos % (individualWidth)) * ratio;
    let alien_center_x = pos + 60;
    let alien_center_y = 330;

    this.dynamicState.timeClock += 1;

    this.signalBulletsUpdate([alien_center_x, alien_center_y]);

    let idx = Math.floor(alien.pos / individualWidth);
    if (this.dynamicState.viewIndex != idx) {
      console.log("total instance:", this.dynamicState.totalInstance);
      if (idx >= this.dynamicState.totalInstance) {
        idx = 0;
      }
      this.switchView(idx);
      dynamic.resetBullets([]);
      //dispatch(addEvent(AlienEvent(alien, getWorld().getInstanceByIndex(idx))));
    }


    // Render minions
    minions.map((m: DynamicMinion) => {
      let minion = m.minion;
      m.countingdown--;
      if (m.countingdown <= 0) {
        m.countingdown = minion.frequency;
        dynamic.addBullet(m.spawnBullet(alien_center_x, alien_center_y, m.offsetX, m.offsetY));
      }
      m.updateMinionPosition(alien_center_x);
    });

    this.signalAlien();
    //console.log("alien pos:", alien.pos, "view index:", idx, "minions:", dynamic.minions.length, "total bullets:", dynamic.bullets.length, dynamic.bulletsInfo());
  }
}
