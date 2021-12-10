export interface Dye {
    color: string;
}
export interface Palette {
    name: string;
    pph: number;
    dye: Array<Dye>;
}

const color_gray = [{color:"#fff"}, {color:"#ddd"}, {color:"#bbb"}, {color:"#999"}, {color:"#777"}];
const color_red = [{color:"#fff"}, {color:"#ddd"}, {color:"#bbb"}, {color:"#999"}, {color:"#777"}];

export const basic =  {name: "Basic Pallette", dye: color_gray, pph:1};
export const red_palette =  {name: "Red Pallette", dye: color_red, pph:2};
