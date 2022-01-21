export interface Weapon {
    code: string;
}
export interface Weapons {
    name: string;
    damage: number;
    weapon: Array<Weapon>;
}

const weapon_basic = [{code:"0x10"}, {code:"0x12"}];
const weapon_advance = [{code:"0x20"}, {code:"0x22"}];

export const weapon_01 =  {name: "Basic Weapon", weapon: weapon_basic, damage:1};
export const weapon_02 =  {name: "Poision Arrow", weapon: weapon_advance, damage:2};
