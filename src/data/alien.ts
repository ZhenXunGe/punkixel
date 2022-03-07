export interface Alien {
  alienId: number;
  name: string;
  status: "run" | "dizzle";
  pos: number;
  dizzle: number;
}
