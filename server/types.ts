export type BulletModifier = "missle" | "bomb" | "bullet" | "freeze" | "explode";
export type MinionType = "ufo" | "airballoon" | "land";
export type DyeIndex = number;

export const individualWidth:number = 250;
export const individualHeight:number = 100;


export interface Dye {
    color: Array<number>;
    weight: number;
}

export interface Palette {
    name: string;
    pph: number;
    dye: Array<Dye>;
    idx: number;
    rotation: number;
    dilation: number;
}

export interface ColorCategory {
  name:string;
  palettes: Array<number>;
}


export interface Player {
  id: string;
  energy: number;
  punkxiel: number;
  ranking: number;
  voucher: number;
  palettes: Array<ColorCategory>;
  homeIndex: number;
  inventory: Array<string | null>;
}


export interface Minion {
  owner: string; //owner block number
  id: string;
  location: number | null;
  x: number;
  y: number;
  power: number;
  frequency: number;
  modifier: Array<BulletModifier>;
  contribution: number;
  style: number;
  type: MinionType;
}

export interface InstanceInfo {
    index: number;
    content: Array<Array<DyeIndex>>;
    background: number;
    minions: Array<string>;
    drops: Array<number>;
    owner: string;
    ratio: number;
    pph: number;
    reward: number;
    basePPH: number;
    sketched: boolean;
}

export interface Alien {
  sprite: string;
  id: string;
  name: string;
  status: "run" | "dizzle";
  pos: number;
  dizzle: number;
  speed: number;
  drop: Array<string>;
  favourate: string;
}

export type SourceObjectType = "minion" | "alien" | "player" | "instance";

export interface SourceObject {
  objType: SourceObjectType;
  objId: string;
  amount: number;
}

function newSource(typ: SourceObjectType, id: string, n=0): SourceObject {
  return {
    objType: typ,
    objId: id,
    amount: n,
  }
}

export interface SysEvent {
    id: number;
    tx: number;
    time: number;
    source: Array<SourceObject>;
}

const EventAdvice = 0x01;
const EventAlienEnter = 0x10;
const EventAlienKnock = 0x20;
const EventAlienDrop = 0x30;
const EventMinionProtecting = 0x11;

export function alienEventEnter(monster: Alien, instance: InstanceInfo): SysEvent {
    return {
        id: EventAlienEnter,
        tx: 0,
        time: Date.now(),
        source: [newSource("alien", monster.id), newSource("instance", instance.index.toString())],
    }
}

interface MinionRewardInfo {
    minion: Minion;
    amount: number;
}
export interface RewardInfo {
    reserve: number;
    rewards: Array<MinionRewardInfo>;
}

export function rewardEvent(alienId: string, instance: InstanceInfo, rewards: RewardInfo): SysEvent {
    let r = [];
    r.push(newSource("alien", alienId));
    r.push(newSource("player", instance.owner, rewards.reserve));
    r.push(newSource("instance", instance.index.toString()));
    for (var m of rewards.rewards) {
      r.push(newSource("minion", m.minion.id, m.amount));
    }
    return {
        tx: EventAlienKnock,
        id: 0,
        time: Date.now(),
        source: r,
    };
}

export function protectEvent(account: string, instance: InstanceInfo, minion:Minion): SysEvent {
    return {
        tx: EventMinionProtecting,
        id: 0,
        time: Date.now(),
        source: [newSource("player", account)],
    };
}

export function dropEvent(account: string, instance: InstanceInfo, drops: Array<SourceObject>): SysEvent {
    let r = drops;
    r.unshift(newSource("instance", instance.index.toString()));
    r.unshift(newSource("player", account));
    return {
        tx: EventAlienDrop,
        id: 0,
        time: Date.now(),
        source: r
    }
}
