import { Alien } from "../data/alien";
import { Instance } from "../data/instance";



export interface Event {
    id: number;
    tx: number;
    time: number;
    description: string;
    source: any;
}

const AlienMoveEvent = 0x10;
const AlienKnockEvent = 0x20;
const MinionProtectingEvent = 0x11;



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
        id: MinionProtectingEvent,
        tx: 0,
        time: Date.now(),
        source: user,
        description: `Alien ${user} has sent minion to protect block ${instance.info.id}`,
    }
}

export function DropEvent(user: string, instance: Instance):Event {
    return {
        id: AlienKnockEvent,
        tx: 0,
        time: Date.now(),
        source: user,
        description: `Alien ${user} was knocked in ${instance.info.id}, 100 punkxiels dropped`,
    }
}
