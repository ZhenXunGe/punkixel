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
}

const color_trans = [
    {color:[0xee, 0xee, 0xee], weight:1},
    {color:[0xff, 0xff, 0xff], weight:1}
];
const color_gray = [
    {color:[0xff, 0xff, 0xff], weight:1},
    {color:[0xdd, 0xdd, 0xdd], weight:1},
    {color:[0xbb, 0xbb, 0xbb], weight:1},
    {color:[0x99, 0x99, 0x99], weight:1},
    {color:[0x77, 0x77, 0x77], weight:1}
];

const color_red = [
    {color:[0xff, 0x0, 0x0], weight:1},
    {color:[0xdd, 0x0, 0x0], weight:1},
    {color:[0xbb, 0x0, 0x0], weight:1}
];

const color_shine = [
    {color:[0x0, 0xff, 0x00], weight:1},
    {color:[0x0, 0xcc, 0xcc], weight:1},
    {color:[0x0, 0xbb, 0xbb], weight:1}
];

export const transparent =  {name: "nil", dye: color_trans, pph:0, idx:0, rotation:0};
export const basic =  {name: "Basic Pallette", dye: color_gray, pph:1, idx:1, rotation:0};
export const red_palette =  {name: "Red Pallette", dye: color_red, pph:2, idx:2, rotation:0};
export const shine_palette =  {name: "Shining Pallette", dye: color_shine, pph:2, idx:3, rotation:1};

export const dye_table :Array<Palette> = [
  transparent,
  basic,
  red_palette,
  shine_palette,
]

export type DyeIndex = number;

export function IsNillDye(idx:DyeIndex) {
  return (idx === 0);
}

export function ofDyeIndex(index: number) {
  // each palette only contains at most 16 colors
  return dye_table[(index-index%16)/16].dye[index % 16];
}

export function toDyeIndex(palette:number, dye:number) {
  console.log("to dye index:", palette, dye);
  return (palette* 16 + dye);
}

export function toDyeColor(index: number, shine: number) {
  let palette = dye_table[(index-index%16)/16];
  let dye = palette.dye[(index%16 + shine*palette.rotation) % (palette.dye.length)];
  return dye.color;
}
