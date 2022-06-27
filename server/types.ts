export type BulletModifier = "missle" | "bomb" | "bullet" | "freeze" | "explode";
export type MinionType = "ufo" | "airballoon" | "land";
export type DyeIndex = number;

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
  palettes: Array<Palette>;
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
    id: string;
    content: Array<Array<DyeIndex>>;
    background: number;
    minions: Array<string>;
    drops: Array<number>;
    owner: string;
    ratio: number;
    pph: number;
    basePPH: number;
    sketched: boolean;
}
