export interface Dye {
    color: string;
    weight: number;
}
export interface Palette {
    name: string;
    pph: number;
    dye: Array<Dye>;
}

const color_gray = [{color:"#fff", weight:1}, {color:"#ddd", weight:1}, {color:"#bbb", weight:1}, {color:"#999", weight:1}, {color:"#777", weight:1}];
const color_red = [{color:"#f00", weight:1}, {color:"#d00", weight:1}, {color:"#b00", weight:1}];

export const basic =  {name: "Basic Pallette", dye: color_gray, pph:1};
export const red_palette =  {name: "Red Pallette", dye: color_red, pph:2};

export const dye_table = [
  {name: "nil", dye:[], pph:0}, // Dummy place holder dye
  basic,
  red_palette,
]

export type DyeIndex = number;

export function IsNillDye(idx:DyeIndex) {
  return (idx === 0);
}

export function ofDyeIndex(index: number) {
  // each palette only contains at most 16 colors
  return dye_table[(index-index%16)/16].dye[index % 16];
}
