import { DyeIndex, Dye, Palette, individualWidth, individualHeight, compressDyeIndex } from "./types";

export function IsNillDye(idx:DyeIndex) {
  return (idx === 0);
}

function buildPaletteDye(colorHex: string, weight: number) {
  var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(colorHex)!;
  return {
    color: [parseInt(result[1], 16), parseInt(result[2], 16), parseInt(result[3], 16)],
    weight: weight,
  };
}

function buildPalettes(colors: string[], weight: number) {
  return colors.map((hexColor) => {return buildPaletteDye(hexColor, 1);});
}

const color_trans = [
    {color:[0xee, 0xee, 0xee], weight:1},
    {color:[0xff, 0xff, 0xff], weight:1}
];

const color_gray = buildPalettes([
    "#ffffff",
    "#dddddd",
    "#bbbbbb",
    "#999999",
    "#777777",
    "#555555",
    "#333333",
    "#111111",
], 1);

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
  gray_palette,
];

function buildSpinPalette(name:string, palette:any, idx:number) {
  return {
    name: name,
    dye: palette,
    pph:2,
    idx: idx,
    rotation: 24,
    dilation: 0
  }
}

/*
 * Colour palette Spin
 */

const spin_fire= buildPalettes([
        "#f8e332",
        "#f96b1d",
        "#ff2e05",
        "#f8e332",
        "#f96b1d",
        "#ff2e05",
        "#f8e332",
        "#f96b1d",
],1);

const spin_traffic_light = buildPalettes([
        "#eb2121",
        "#f5de18",
        "#19d939",
        "#f5de18",
        "#eb2121",
        "#f5de18",
        "#19d939",
        "#f5de18",
],1);


const spin_signal = buildPalettes([
        "#e01d1d",
        "#2e0fea",
        "#e01d1d",
        "#2e0fea",
        "#e01d1d",
        "#2e0fea",
        "#e01d1d",
        "#2e0fea",
],1);

const spin_flash_light = buildPalettes([
        "#f8e332",
        "#ffffff",
        "#f8e332",
        "#ffffff",
        "#f8e332",
        "#ffffff",
        "#f8e332",
        "#ffffff",
],1);

const spin_fluoresent_blue = buildPalettes([
        "#ffffff",
        "#00ffff",
        "#16f2d5",
        "#13db97",
        "#ffffff",
        "#00ffff",
        "#16f2d5",
        "#13db97",
],1);

const spin_barbers_pole = buildPalettes([
        "#1922d9",
        "#ffffff",
        "#fb3030",
        "#ffffff",
        "#1922d9",
        "#ffffff",
        "#fb3030",
        "#ffffff",
],1);


const spin_rainbow = buildPalettes([
        "#e92222",
        "#e6600e",
        "#f6da20",
        "#2ee43f",
        "#20b1e6",
        "#1f44e2",
        "#9332de",
        "#ef25aa",
], 1);

const spin_light_rainbow = buildPalettes([
        "#ed7d7d",
        "#f0945c",
        "#f3e586",
        "#87f691",
        "#84cee9",
        "#8393d8",
        "#b78ed7",
        "#eda5d4",
], 1);

const spin_glitter_red = buildPalettes([
        "#ff2021",
        "#e25d62",
        "#e50034",
        "#ff6373",
        "#ee0008",
        "#ff2a63",
        "#ff2a63",
        "#ff6791",
], 1);

const spin_glitter_orange = buildPalettes([
        "#ff9d20",
        "#e2a35d",
        "#e54d00",
        "#ffaa63",
        "#ee7e00",
        "#ff682a",
        "#ff501a",
        "#ff9267",
], 1);

const spin_glitter_yellow = buildPalettes([
        "#fff920",
        "#e2da5d",
        "#e5ac00",
        "#ffeb63",
        "#eee000",
        "#ffc12a",
        "#ffae1a",
        "#ffd167",
], 1);

const spin_glitter_green = buildPalettes([
        "#6bff20",
        "#8ee25d",
        "#80e500",
        "#a7ff63",
        "#57ee00",
        "#aaff2a",
        "#b1ff1a",
        "#c4ff67",
], 1);

const spin_glitter_cyan = buildPalettes([
        "#ff2021",
        "#73c6cc",
        "#1bc9b2",
        "#63fffd",
        "#17cad7",
        "#2affda",
        "#1affc9",
        "#67ffe3",
], 1);

const spin_glitter_blue = buildPalettes([
        "#0c76a3",
        "#3b7388",
        "#00818b",
        "#00aad7",
        "#006991",
        "#00b0b3",
        "#00aba6",
        "#01d4d9",
], 1);

const spin_glitter_purple = buildPalettes([
        "#7160d5",
        "#958ec8",
        "#444cb3",
        "#9fc5d9",
        "#7e5fa8",
        "#bc82d2",
        "#5581d9",
        "#daa6ed",
], 1);

const spin_glitter_brown = buildPalettes([
        "#816f28",
        "#746948",
        "#6d4b19",
        "#d09400",
        "#736019",
        "#9c5c11",
        "#a55000",
        "#a76c2b",
], 1);

const liquid_palettes = [
  buildSpinPalette("Spin Fire", spin_fire, 0),
  buildSpinPalette("Spin Traffic Light", spin_traffic_light, 1),
  buildSpinPalette("Spin Signal", spin_signal, 2),
  buildSpinPalette("Spin Flash Light", spin_flash_light, 3),
  buildSpinPalette("Spin Fluoresent", spin_fluoresent_blue, 4),
  buildSpinPalette("Spin Barbers Pole", spin_barbers_pole, 5),
  buildSpinPalette("Spin Rainbow", spin_rainbow, 6),
  buildSpinPalette("Spin Light Rainbow", spin_light_rainbow, 7),
  buildSpinPalette("Spin Glitter Red", spin_glitter_red, 8),
  buildSpinPalette("Spin Glitter Orange", spin_glitter_orange, 9),
  buildSpinPalette("Spin Glitter Yellow", spin_glitter_yellow, 10),
  buildSpinPalette("Spin Glitter Green", spin_glitter_green, 11),
  buildSpinPalette("Spin Glitter Cyan", spin_glitter_cyan, 12),
  buildSpinPalette("Spin Glitter Blue", spin_glitter_blue, 13),
  buildSpinPalette("Spin Glitter Purple", spin_glitter_purple, 14),
  buildSpinPalette("Spin Glitter Brown", spin_glitter_brown, 15),
]



/*
 * Radiation color
 *
 * */
const rad_neon_red = buildPalettes([
        "#ffffff",
        "#eed2d0",
        "#f08c89",
        "#f3523c",
        "#f92a2a",
        "#f92a2a",
        "#a21818",
        "#6e0b0b",
], 1);


const rad_neon_orange= buildPalettes([
        "#ffffff",
        "#f4dbca",
        "#ffaa7a",
        "#ff8e30",
        "#ff6d24",
        "#de4a00",
        "#ba3e00",
        "#792800",
], 1);

const rad_neon_yellow = buildPalettes([
        "#ffffff",
        "#f2ebcb",
        "#ffe17a",
        "#ffe430",
        "#ffc724",
        "#d6a107",
        "#b68904",
        "#795a00",
], 1);

const rad_neon_lime = buildPalettes([
        "#ffffff",
        "#e2eed0",
        "#cbf089",
        "#9ff33c",
        "#b3f92a",
        "#89bf1f",
        "#74a218",
        "#4d6e0b",
], 1);

const rad_neon_green = buildPalettes([
        "#ffffff",
        "#d0edd9",
        "#8beea6",
        "#3fef80",
        "#2ef560",
        "#22bc48",
        "#1a9f3b",
        "#0d6c25",
], 1);

const rad_neon_cyan = buildPalettes([
        "#ffffff",
        "#cef1ef",
        "#81faed",
        "#34fffb",
        "#28ffe2",
        "#13cfb5",
        "#0fb19b",
        "#067a6a",
], 1);

const rad_sky_blue = buildPalettes([
        "#ffffff",
        "#d0e7ee",
        "#89dbf0",
        "#3cbdf3",
        "#2ad5f9",
        "#1fa3bf",
        "#188aa2",
        "#0b5d6e",
], 1);

const rad_neon_sea_foam = buildPalettes([
        "#ffffff",
        "#d4dde9",
        "#98bce1",
        "#5689d8",
        "#4894db",
        "#3671a8",
        "#2c5f8e",
        "#193d5f",
], 1);

const rad_neon_blue = buildPalettes([
        "#ffffff",
        "#cad3f4",
        "#7a9cff",
        "#3051ff",
        "#2462ff",
        "#003ede",
        "#0034ba",
        "#002279",
], 1);

const rad_neon_purple = buildPalettes([
        "#ffffff",
        "#dfcaf4",
        "#b77aff",
        "#a330ff",
        "#8324ff",
        "#6000de",
        "#5100ba",
        "#340079",
], 1);

const rad_neon_pink = buildPalettes([
        "#ffffff",
        "#efcef0",
        "#ee82f7",
        "#ff30f9",
        "#e924ff",
        "#b714c9",
        "#9b0fab",
        "#690474",
], 1);

const rad_neon_rose = buildPalettes([
        "#ffffff",
        "#eed0d8",
        "#f089aa",
        "#f33c65",
        "#f92a72",
        "#bf1f57",
        "#a21848",
        "#6e0b2d",
], 1);

const rad_copper = buildPalettes([
        "#f4ecc1",
        "#eadc83",
        "#d3ae4a",
        "#d89a56",
        "#db8348",
        "#a86336",
        "#8e532c",
        "#5f3519",
], 1);

const rad_silver = buildPalettes([
        "#ffffff",
        "#dadada",
        "#aaaaaa",
        "#808080",
        "#686868",
        "#4f4f4f",
        "#414141",
        "#292929",
], 1);

const rad_gold = buildPalettes([
        "#fffddd",
        "#fffab1",
        "#fff782",
        "#fff458",
        "#e9db10",
        "#ba8f1c",
        "#7c5710",
        "#634515",
], 1);

const rad_fluorescence = buildPalettes([
        "#bbfec1",
        "#a3fab1",
        "#5ce0a6",
        "#58c8b2",
        "#6ca4ca",
        "#918ae3",
        "#8e5ad7",
        "#4d5dd0",
], 1);

function buildDilationPalette(name:string, palette:any, idx:number) {
  return {
    name: name,
    dye: palette,
    pph:2,
    idx: idx,
    dilation: 14,
    rotation:0,
  }
}


const dilation_palettes = [
  buildDilationPalette("Neon Read", rad_neon_red, 0),
  buildDilationPalette("Neon Orange", rad_neon_orange, 1),
  buildDilationPalette("Neon Yellow", rad_neon_yellow, 2),
  buildDilationPalette("Neon Lime", rad_neon_lime, 3),
  buildDilationPalette("Neon Green", rad_neon_green, 4),
  buildDilationPalette("Neon Cyan", rad_neon_cyan, 5),
  buildDilationPalette("Neon Skey Blue", rad_sky_blue, 6),
  buildDilationPalette("Neon Sea Foam", rad_neon_sea_foam, 7),
  buildDilationPalette("Neon Blue", rad_neon_blue, 8),
  buildDilationPalette("Neon Purple", rad_neon_purple, 9),
  buildDilationPalette("Neon Pink", rad_neon_pink, 10),
  buildDilationPalette("Neon Rose", rad_neon_rose, 11),
  buildDilationPalette("Copper", rad_copper, 12),
  buildDilationPalette("Silver", rad_silver, 13),
  buildDilationPalette("Gole", rad_gold, 14),
  buildDilationPalette("Fluorescence", rad_fluorescence, 15),
]

export const dye_table :Array<Array<Palette>> = [
  [transparent],
  basic_palettes,
  liquid_palettes,
  dilation_palettes,
];

export function getCategory(cindex: number):Array<Palette> {
  return dye_table[cindex];
}

export function ofPaletteIndex(index: number):Palette {
  let cindex = (index - index%256)/256;
  let pindex = index%256;
  pindex = (pindex - pindex%16)/16;
  return dye_table[cindex][pindex];
}

export function getPalette(index: number):Palette {
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

export function toPaletteIndex(c: number, p:number) {
  return (c*16 + p);
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

export function compressContent(content: Array<Array<number>>) {
  let c = "";
  let total = individualWidth * individualHeight;
  for (var i=0; i<total; i++) {
    c = c + compressDyeIndex(content[0][i]);
  }
  for (i=0; i<total; i++) {
    c = c + compressDyeIndex(content[1][i]);
  }
  for (i=0; i<total; i++) {
    c = c + compressDyeIndex(content[2][i]);
  }
  return c;
}
