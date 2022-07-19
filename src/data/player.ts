import { amber_dilation_palette, basic_palettes, ColorCategory, lightblue_dilation_palette, liquid_blue_palette, liquid_green_palette, pink_dilation_palette, red_dilation_palette } from "./palette";
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

export function createTestPlayer(account: string, index: number): Player {
  let player = {
    id: account,
    energy: 50,
    punkxiel: 10000,
    ranking: 99,
    pph: 0,
    voucher: 1,
    palettes: [{
      name: "basic",
      palettes: basic_palettes,
    },
    {
      name: "spin",
      palettes: [
        liquid_green_palette,
        liquid_blue_palette,
      ]
    },
    {
      name: "dilation",
      palettes: [
        lightblue_dilation_palette,
        red_dilation_palette,
        pink_dilation_palette,
        amber_dilation_palette
      ]
    }
    ],
    inventory: [null, null, null, null, null],
    homeIndex: index,
  };
  return player;
}

