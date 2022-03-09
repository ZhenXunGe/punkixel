import { Alien } from "../data/alien";
import { Instance } from "../data/instance";



export interface Event {
    id: number;
    tx: number;
    time: Date;
    description: string;
    source: any;
}

const AlienMoveEvent = 0x10;


export function AlienEvent(monster: Alien, instance: Instance) {
    return {
        id: AlienMoveEvent,
        tx: 0,
        time: Date.now(),
        source: monster,
        description: `Alien ${monster.name} has entered block ${instance.info.id}`,
    }
}


export function ProtectingEvent(user: string, instance: Instance) {
    return {
        id: AlienMoveEvent,
        tx: 0,
        time: Date.now(),
        source: user,
        description: `Alien ${user} has sent minion to protect block ${instance.info.id}`,
    }
}

