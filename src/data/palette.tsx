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


function buildPaletteDye(colorHex: string, weight: number) {
  var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(colorHex)!;
  return {
    color: [parseInt(result[1], 16), parseInt(result[2], 16), parseInt(result[3], 16)],
    weight: weight,
  };
}

function buildPallete(dye: Dye, name: string, pph: number, index:number, rotation:number, dilation:number) {
  return {
    name: name,
    dye: dye,
    pph: pph,
    idx: index,
    rotation: rotation,
    dilation: dilation,
  }
}

function buildPalettes(colors: string[], weight: number) {
  return colors.map((hexColor) => {return buildPaletteDye(hexColor, 1);});
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

const color_red = buildPalettes([
      "#f9bdbb",
      "#f69988",
      "#f36c60",
      "#e84c40",
      "#e81c23",
      "#dd191d",
      "#d01716",
      "#c41411",
],1);

const color_pink = buildPalettes([
      "#f8bbd0",
      "#f48fb1",
      "#f06292",
      "#ec407a",
      "#e91e63",
      "#d81b60",
      "#c2185b",
      "#ad1457",
],1);

const color_purple = buildPalettes([
      "#e1bee7",
      "#ce93d8",
      "#ba68c8",
      "#ab47bc",
      "#9c27b0",
      "#8e24aa",
      "#7b1fa2",
      "#6a1b9a",
],1);


const color_indigo = buildPalettes([
      "#c5cae9",
      "#9fa8da",
      "#7986cb",
      "#5c6bc0",
      "#3f51b5",
      "#3949ab",
      "#303f9f",
      "#283593",
],1);


const color_blue = buildPalettes([
      "#d0d9ff",
      "#afbfff",
      "#91a7ff",
      "#738ffe",
      "#5677fc",
      "#4e6cef",
      "#455ede",
      "#3b50ce",
],1);

const color_lightblue = buildPalettes([
      "#b3e5fc",
      "#81d4fa",
      "#4fc3f7",
      "#29b6f6",
      "#03a9f4",
      "#039be5",
      "#0288d1",
      "#0277bd",
],1);

const color_cyan = buildPalettes([
        "#b2ebf2",
        "#80deea",
        "#4dd0e1",
        "#26c6da",
        "#00bcd4",
        "#00acc1",
        "#0097a7",
        "#00838f",
],1);

const color_teal = buildPalettes([
        "#b2dfdb",
        "#80cdc4",
        "#4db6ac",
        "#26a69a",
        "#009688",
        "#00897b",
        "#00796b",
        "#00695c",
],1);

const color_green = buildPalettes([
        "#a3e9a4",
        "#72d572",
        "#42bd41",
        "#2baf2b",
        "#259b24",
        "#0a8f08",
        "#0a7e07",
        "#056f00",
],1);

const color_lightgreen = buildPalettes([
        "#dcedc8",
        "#c5e1a5",
        "#aed581",
        "#9ccc65",
        "#8bc34a",
        "#7cb342",
        "#689f38",
        "#558b2f",
],1);

const color_lime = buildPalettes([
        "#f0f4c3",
        "#e6ee9c",
        "#dce775",
        "#d4e157",
        "#cddc39",
        "#c0ca33",
        "#afb42b",
        "#9e9d24",
],1);

const color_yellow = buildPalettes([
        "#fff9c4",
        "#fff59d",
        "#fff176",
        "#ffee58",
        "#ffeb3b",
        "#fdd835",
        "#fbc02d",
        "#f9a825",

],1);


const color_amber = buildPalettes([
        "#ffecb3",
        "#ffe082",
        "#ffd54f",
        "#ffca28",
        "#ffc107",
        "#ffb300",
        "#ffa000",
        "#ff8f00",


],1);

const color_orange = buildPalettes([
        "#ffe0b2",
        "#ffcc80",
        "#ffb74d",
        "#ffa726",
        "#ff9800",
        "#fb8c00",
        "#f57c00",
        "#ef6c00",
],1);

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

export const transparent =  {name: "nil", dye: color_trans, pph:0, idx:0, rotation:0, dilation:0};

export const gray_palette =  {name: "Gray Pallette", dye: color_gray, pph:1, idx:0, rotation:0, dilation:0};
export const red_palette =  {name: "Red Pallette", dye: color_red, pph:1, idx:1, rotation:0, dilation:0};
export const pink_palette =  {name: "Pink Pallette", dye: color_pink, pph:1, idx:2, rotation:0, dilation:0};
export const purple_palette =  {name: "Purple Pallette", dye: color_purple, pph:1, idx:3, rotation:0, dilation:0};
export const indigo_palette =  {name: "Indigo Pallette", dye: color_indigo, pph:1, idx:4, rotation:0, dilation:0};
export const blue_palette =  {name: "Blue Pallette", dye: color_blue, pph:1, idx:5, rotation:0, dilation:0};
export const lightblue_palette =  {name: "LightBule Pallette", dye: color_lightblue, pph:1, idx:6, rotation:0, dilation:0};
export const cyan_palette =  {name: "Cyan Pallette", dye: color_cyan, pph:1, idx:7, rotation:0, dilation:0};
export const teal_palette =  {name: "Teal Pallette", dye: color_teal, pph:1, idx:8, rotation:0, dilation:0};
export const green_palette =  {name: "Green Pallette", dye: color_green, pph:1, idx:9, rotation:0, dilation:0};
export const lightgreen_palette =  {name: "LightGreen Pallette", dye: color_lightgreen, pph:10, idx:3, rotation:0, dilation:0};
export const lime_palette =  {name: "Lime Pallette", dye: color_lime, pph:1, idx:11, rotation:0, dilation:0};
export const yellow_palette =  {name: "Yellow Pallette", dye: color_yellow, pph:1, idx:12, rotation:0, dilation:0};
export const amber_palette =  {name: "Amber Pallette", dye: color_amber, pph:1, idx:13, rotation:0, dilation:0};
export const orange_palette =  {name: "Orange Pallette", dye: color_orange, pph:1, idx:14, rotation:0, dilation:0};

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

export const liquid_green_palette =  {name: "Shining Green", dye: color_liquid_green, pph:2, idx:0, rotation:20, dilation:0};
export const liquid_blue_palette =  {name: "Shining Green", dye: color_liquid_blue, pph:2, idx:1, rotation:20, dilation:0};

export const lightblue_dilation_palette =  {name: "LightBule Pallette", dye: color_lightblue, pph:1, idx:0, rotation:0, dilation:14};
export const red_dilation_palette =  {name: "Red Pallette", dye: color_red, pph:1, idx:1, rotation:0, dilation:14};
export const pink_dilation_palette =  {name: "Pink Pallette", dye: color_pink, pph:1, idx:2, rotation:0, dilation:14};
export const amber_dilation_palette=  {name: "Amber Pallette", dye: color_amber, pph:1, idx:3, rotation:0, dilation:14};

export const dye_table :Array<Array<Palette>> = [
  [transparent],
  basic_palettes,
  [liquid_green_palette,liquid_blue_palette],
  [lightblue_dilation_palette, red_dilation_palette, pink_dilation_palette, amber_dilation_palette],
];

export type DyeIndex = number;

export function IsNillDye(idx:DyeIndex) {
  return (idx === 0);
}

export function ofPaletteIndex(index: number):Palette {
  let cindex = (index - index%256)/256;
  let pindex = index%256;
  pindex = (pindex - pindex%16)/16;
  return dye_table[cindex][pindex];
}

export function getPalette(index: number):Palette {
  console.log("getPalette", index);
  return ofPaletteIndex(index * 16);
}

export function ofDyeIndex(index: number):Dye {
  // each palette only contains at most 16 colors
  let palette = ofPaletteIndex(index);
  return palette.dye[index % 16];
}

export function pphOfDyeIndex(index: number):number {
  let palette = ofPaletteIndex(index);
  return palette.pph;
}


export function costOfDyeIndex(index: number):number {
  let dye = ofDyeIndex(index);
  return dye.weight;
}


export function toDyeIndex(c: number, palette:number, dye:number) {
  return (c*256 + palette* 16 + dye);
}

export function toDyeColor(index: number, shine: number) {
  let palette = ofPaletteIndex(index);
  if (palette.rotation === 0) {
    let dye = palette.dye[(index%16) % (palette.dye.length)];
    return dye.color;
  } else {
    let rotate = Math.floor(shine/palette.rotation + 1);
    let dye = palette.dye[(index%16 + rotate) % (palette.dye.length)];
    return dye.color;
  }
}

export function dilationDistance(index: number) {
  let palette = ofPaletteIndex(index);
  return palette.dilation;
}

export function findColor(r:number, g:number, b:number) {
  let idx = 0;
  let min = 100000;
  for (var i=1; i<dye_table.length; i++) {
    let palettes = dye_table[i];
    for (var p=0; p<palettes.length; p++) {
      let palette = palettes[p];
      for (var d=0; d<palette.dye.length; d++) {
        let dye = palette.dye[d];
        let distance = Math.sqrt(
            Math.pow(dye.color[0] - r,2)
            + Math.pow(dye.color[1] - g,2)
            + Math.pow(dye.color[2] - b,2)
            );
        if (distance < min) {
          idx = toDyeIndex(i, p, d);
          min = distance;
        }
      }
    }
  }
  if(min > 30) {
    //console.log("can not find color",r,g,b,min);
    return findGrayColor(r, g, b);
  } else {
    //console.log("find color", r, g, b, min);
  }
  return idx;
}
export function findGrayColor(r: number, g: number, b: number) {
  let palette = dye_table[1][0];
  let idx = 0;
  let min = 100000;
  for (var d = 0; d < palette.dye.length; d++) {
    let dye = palette.dye[d];
    let distance = Math.sqrt(
      Math.pow(dye.color[0] - r,2)
      + Math.pow(dye.color[1] - g,2)
      + Math.pow(dye.color[2] - b,2)
      );
    if (distance < min) {
      idx = toDyeIndex(1, 0, d);
      min = distance;
    }
  }
  if (min > 50) {
    return 0;
  }
  if (idx < 256 ) {
    console.log("dyeindex:", idx);
    throw Error("invalid idx");
  }
  return idx;
}
