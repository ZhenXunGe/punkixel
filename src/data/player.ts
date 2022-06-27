import { ColorCategory } from "./palette";
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
