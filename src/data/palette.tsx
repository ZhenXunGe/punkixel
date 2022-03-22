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

export interface ColorCategory {
  name:string;
  palettes: Array<Palette>;
}


function buildPaletteDye(colorHex: string, weight: number) {
  var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(colorHex)!;
  return {
    color: [parseInt(result[1], 16), parseInt(result[2], 16), parseInt(result[3], 16)],
    weight: weight,
  };
}

function buildPallete(dye: Dye, name: string, pph: number, index:number, rotation:number) {
  return {
    name: name,
    dye: dye,
    pph: pph,
    idx: index,
    rotation: rotation
  }
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
    {color:[0x77, 0x77, 0x77], weight:1},
    {color:[0x55, 0x55, 0x55], weight:1},
    {color:[0x33, 0x33, 0x33], weight:1},
    {color:[0x11, 0x11, 0x11], weight:1},
];

const color_red = [
    buildPaletteDye("#f9bdbb", 1),
    buildPaletteDye("#f69988", 1),
    buildPaletteDye("#f36c60", 1),
    buildPaletteDye("#e84e40", 1),
    buildPaletteDye("#e81c23", 1),
    buildPaletteDye("#dd191d", 1),
    buildPaletteDye("#d01716", 1),
    buildPaletteDye("#c41411", 1),
    buildPaletteDye("#b0120a", 1),
];

const color_pink = [
    buildPaletteDye("#f9bdbb", 1),
    buildPaletteDye("#f69988", 1),
    buildPaletteDye("#f36c60", 1),
    buildPaletteDye("#e84e40", 1),
    buildPaletteDye("#e81c23", 1),
    buildPaletteDye("#dd191d", 1),
    buildPaletteDye("#d01716", 1),
    buildPaletteDye("#c41411", 1),
    buildPaletteDye("#b0120a", 1),
];

const color_purple = [
    buildPaletteDye("#e1bee7", 1),
    buildPaletteDye("#ce93d8", 1),
    buildPaletteDye("#f36c60", 1),
    buildPaletteDye("#e84e40", 1),
    buildPaletteDye("#e81c23", 1),
    buildPaletteDye("#dd191d", 1),
    buildPaletteDye("#d01716", 1),
    buildPaletteDye("#c41411", 1),
    buildPaletteDye("#b0120a", 1),
];


const color_indigo = [
    buildPaletteDye("#f9bdbb", 1),
    buildPaletteDye("#f69988", 1),
    buildPaletteDye("#f36c60", 1),
    buildPaletteDye("#e84e40", 1),
    buildPaletteDye("#e81c23", 1),
    buildPaletteDye("#dd191d", 1),
    buildPaletteDye("#d01716", 1),
    buildPaletteDye("#c41411", 1),
    buildPaletteDye("#b0120a", 1),
];

const color_blue = [
    buildPaletteDye("#d0d9ff", 1),
    buildPaletteDye("#afbfff", 1),
    buildPaletteDye("#91a7ff", 1),
    buildPaletteDye("#738ffe", 1),
    buildPaletteDye("#5677fc", 1),
    buildPaletteDye("#4e6cef", 1),
    buildPaletteDye("#455ede", 1),
    buildPaletteDye("#3b50ce", 1),
    buildPaletteDye("#2a36b1", 1),
];

const color_lightblue = [
    buildPaletteDye("#d0d9ff", 1),
    buildPaletteDye("#afbfff", 1),
    buildPaletteDye("#91a7ff", 1),
    buildPaletteDye("#738ffe", 1),
    buildPaletteDye("#5677fc", 1),
    buildPaletteDye("#4e6cef", 1),
    buildPaletteDye("#455ede", 1),
    buildPaletteDye("#3b50ce", 1),
    buildPaletteDye("#2a36b1", 1),
];

const color_cyan = [
    buildPaletteDye("#d0d9ff", 1),
    buildPaletteDye("#afbfff", 1),
    buildPaletteDye("#91a7ff", 1),
    buildPaletteDye("#738ffe", 1),
    buildPaletteDye("#5677fc", 1),
    buildPaletteDye("#4e6cef", 1),
    buildPaletteDye("#455ede", 1),
    buildPaletteDye("#3b50ce", 1),
    buildPaletteDye("#2a36b1", 1),
];

const color_teal = [
    buildPaletteDye("#d0d9ff", 1),
    buildPaletteDye("#afbfff", 1),
    buildPaletteDye("#91a7ff", 1),
    buildPaletteDye("#738ffe", 1),
    buildPaletteDye("#5677fc", 1),
    buildPaletteDye("#4e6cef", 1),
    buildPaletteDye("#455ede", 1),
    buildPaletteDye("#3b50ce", 1),
    buildPaletteDye("#2a36b1", 1),
];

const color_green = [
    buildPaletteDye("#d0d9ff", 1),
    buildPaletteDye("#afbfff", 1),
    buildPaletteDye("#91a7ff", 1),
    buildPaletteDye("#738ffe", 1),
    buildPaletteDye("#5677fc", 1),
    buildPaletteDye("#4e6cef", 1),
    buildPaletteDye("#455ede", 1),
    buildPaletteDye("#3b50ce", 1),
    buildPaletteDye("#2a36b1", 1),
];

const color_lightgreen = [
    buildPaletteDye("#d0d9ff", 1),
    buildPaletteDye("#afbfff", 1),
    buildPaletteDye("#91a7ff", 1),
    buildPaletteDye("#738ffe", 1),
    buildPaletteDye("#5677fc", 1),
    buildPaletteDye("#4e6cef", 1),
    buildPaletteDye("#455ede", 1),
    buildPaletteDye("#3b50ce", 1),
    buildPaletteDye("#2a36b1", 1),
];

const color_lime = [
    buildPaletteDye("#d0d9ff", 1),
    buildPaletteDye("#afbfff", 1),
    buildPaletteDye("#91a7ff", 1),
    buildPaletteDye("#738ffe", 1),
    buildPaletteDye("#5677fc", 1),
    buildPaletteDye("#4e6cef", 1),
    buildPaletteDye("#455ede", 1),
    buildPaletteDye("#3b50ce", 1),
    buildPaletteDye("#2a36b1", 1),
];

const color_yellow = [
    buildPaletteDye("#d0d9ff", 1),
    buildPaletteDye("#afbfff", 1),
    buildPaletteDye("#91a7ff", 1),
    buildPaletteDye("#738ffe", 1),
    buildPaletteDye("#5677fc", 1),
    buildPaletteDye("#4e6cef", 1),
    buildPaletteDye("#455ede", 1),
    buildPaletteDye("#3b50ce", 1),
    buildPaletteDye("#2a36b1", 1),
];


const color_amber = [
    buildPaletteDye("#d0d9ff", 1),
    buildPaletteDye("#afbfff", 1),
    buildPaletteDye("#91a7ff", 1),
    buildPaletteDye("#738ffe", 1),
    buildPaletteDye("#5677fc", 1),
    buildPaletteDye("#4e6cef", 1),
    buildPaletteDye("#455ede", 1),
    buildPaletteDye("#3b50ce", 1),
    buildPaletteDye("#2a36b1", 1),
];

const color_orange = [
    buildPaletteDye("#d0d9ff", 1),
    buildPaletteDye("#afbfff", 1),
    buildPaletteDye("#91a7ff", 1),
    buildPaletteDye("#738ffe", 1),
    buildPaletteDye("#5677fc", 1),
    buildPaletteDye("#4e6cef", 1),
    buildPaletteDye("#455ede", 1),
    buildPaletteDye("#3b50ce", 1),
    buildPaletteDye("#2a36b1", 1),
];

const color_liquid_green = [
    {color:[0x0, 0xff, 0x00], weight:4},
    {color:[0x0, 0xcc, 0xcc], weight:4},
    {color:[0x0, 0xbb, 0xbb], weight:4}
];

const color_liquid_blue = [
  {color:[0x0, 0xff, 0xcc], weight:4},
  {color:[0xff, 0x00, 0xcc], weight:4},
  {color:[0x0, 0xbb, 0xbb], weight:4}
];

export function toDrop(dyeindex: number): string {
  return "#dye" + dyeindex;
}

export function fromDrop(dropstring: string): number {
  var result = /^#dye?([a-f\d]{2})$/i.exec(dropstring)!;
  return parseInt(result[1], 16)
}

export const transparent =  {name: "nil", dye: color_trans, pph:0, idx:0, rotation:0};

export const gray_palette =  {name: "Gray Pallette", dye: color_gray, pph:1, idx:1, rotation:0};
export const red_palette =  {name: "Red Pallette", dye: color_red, pph:1, idx:2, rotation:0};
export const pink_palette =  {name: "Pink Pallette", dye: color_pink, pph:1, idx:3, rotation:0};
export const purple_palette =  {name: "Purple Pallette", dye: color_purple, pph:1, idx:4, rotation:0};
export const indigo_palette =  {name: "Indigo Pallette", dye: color_indigo, pph:1, idx:5, rotation:0};
export const blue_palette =  {name: "Blue Pallette", dye: color_blue, pph:1, idx:6, rotation:0};
export const lightblue_palette =  {name: "LightBule Pallette", dye: color_lightblue, pph:1, idx:7, rotation:0};
export const cyan_palette =  {name: "Cyan Pallette", dye: color_cyan, pph:1, idx:8, rotation:0};
export const teal_palette =  {name: "Teal Pallette", dye: color_teal, pph:1, idx:9, rotation:0};
export const green_palette =  {name: "Green Pallette", dye: color_green, pph:1, idx:10, rotation:0};
export const lightgreen_palette =  {name: "LightGreen Pallette", dye: color_lightgreen, pph:11, idx:3, rotation:0};
export const lime_palette =  {name: "Lime Pallette", dye: color_lime, pph:1, idx:12, rotation:0};
export const yellow_palette =  {name: "Yellow Pallette", dye: color_yellow, pph:1, idx:13, rotation:0};
export const amber_palette =  {name: "Amber Pallette", dye: color_amber, pph:1, idx:14, rotation:0};
export const orange_palette =  {name: "Orange Pallette", dye: color_orange, pph:1, idx:15, rotation:0};

export const basic_palettes = [
  gray_palette,
  red_palette,
  pink_palette,
  purple_palette,
  indigo_palette,
  blue_palette,
  lightblue_palette,
  cyan_palette,
  teal_palette,
  green_palette,
  lightgreen_palette,
  lime_palette,
  yellow_palette,
  amber_palette,
  orange_palette,
];

export const liquid_green_palette =  {name: "Shining Green", dye: color_liquid_green, pph:2, idx:16, rotation:20};
export const liquid_blue_palette =  {name: "Shining Green", dye: color_liquid_blue, pph:2, idx:17, rotation:20};
export const dye_table :Array<Palette> = [
  [transparent],
  basic_palettes,
  [liquid_green_palette,liquid_blue_palette],
].flat();

export type DyeIndex = number;

export function getPalette(index: number) {
  return dye_table[index];
}

export function IsNillDye(idx:DyeIndex) {
  return (idx === 0);
}

export function ofDyeIndex(index: number) {
  // each palette only contains at most 16 colors
  return dye_table[(index-index%16)/16].dye[index % 16];
}

export function pphOfDyeIndex(index: number) {
  return dye_table[(index-index%16)/16].pph;
}

export function costOfDyeIndex(index: number) {
  return dye_table[(index-index%16)/16].dye[index % 16].weight;
}


export function toDyeIndex(palette:number, dye:number) {
  return (palette* 16 + dye);
}

export function toDyeColor(index: number, shine: number) {
  let palette = dye_table[(index-index%16)/16];
  if (palette.rotation === 0) {
    let dye = palette.dye[(index%16) % (palette.dye.length)];
    return dye.color;
  } else {
    let rotate = Math.floor(shine/palette.rotation + 1);
    let dye = palette.dye[(index%16 + rotate) % (palette.dye.length)];
    return dye.color;
  }
}

export function findColor(r:number, g:number, b:number) {
  for (var i=0; i<dye_table.length; i++) {
    let palette = dye_table[i];
    for (var d=0; d<palette.dye.length; d++) {
      let dye = palette.dye[d];
      if ((dye.color[0] - r) + (dye.color[1] - g) + (dye.color[2] - b) < 20) {
        return toDyeIndex(i, d);
      }
    }
  }
}
  export function findGrayColor(r:number, g:number, b:number) {
      let palette = dye_table[1];
      for (var d=0; d<palette.dye.length; d++) {
        let dye = palette.dye[d];
        if ((dye.color[0] - r) + (dye.color[1] - g) + (dye.color[2] - b) < 20) {
          return toDyeIndex(1, d);
        }
      }

  return 0;
}
