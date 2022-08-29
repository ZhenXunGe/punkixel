export type BulletModifier = "missle" | "bomb" | "bullet" | "freeze" | "explode";
export type MinionType = "ufo" | "airballoon" | "land";

/* index * paletteIndex, * category
 * 8 * 16 * 16 = three hex number
 * */
export type DyeIndex = number;

function decomposeDyeIndex(index: DyeIndex) {
  let cindex = (index - index%256)/256;
  let p = index%256;
  let pindex = (p - p%16)/16;
  let dyindex = p%16;
  return [cindex, pindex, dyindex];
}

function padIndex(i:number) {
  let c = i.toString(16);
  return c;
}

export function decodeDyeIndex(code: string) {
  let c = parseInt(code[0], 16);
  let p = parseInt(code[1], 16);
  let d = parseInt(code[2], 16);
  return c*256 + p*16 + d;
}

export function compressDyeIndex(dyeIndex: DyeIndex) {
  let [c, p, d] = decomposeDyeIndex(dyeIndex);
  return `${padIndex(c)}${padIndex(p)}${padIndex(d)}`;
}

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
  knockDamage: number;
  favourate: string;
}

export type SourceObjectType = "minion" | "alien" | "player" | "instance" | "dye";

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

export function dropEvent(alienId: string, instance: InstanceInfo, dye: number): SysEvent {
    let r = [];
    r.push(newSource("alien", alienId));
    r.push(newSource("player", instance.owner, 0));
    r.push(newSource("instance", instance.index.toString()));
    r.push(newSource("dye", dye.toString()));
    return {
        tx: EventAlienDrop,
        id: 0,
        time: Date.now(),
        source: r
    }
}
