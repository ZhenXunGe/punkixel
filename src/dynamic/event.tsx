
import { Alien } from "../data/alien";
import { Instance } from "../data/instance";
import getWorld from "../data/world";
import PaletteInfo from "../modals/palette";



export interface Event {
    id: number;
    tx: number;
    time: number;
    description: string;
    source: any;
}

const AlienMoveEvent = 0x10;
const AlienKnockEvent = 0x20;
const AlienDropEvent = 0x30;
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

export function RewardEvent(user: string, instance: Instance):Event {
    return {
        id: AlienKnockEvent,
        tx: 0,
        time: Date.now(),
        source: user,
        description: `Alien ${user} was knocked in ${instance.info.id}, 100 punkxiels dropped`,
    }
}



export function DropEvent(user: string, instance: Instance, drops:string[]):Event {
    return {
        id: AlienDropEvent,
        tx: 0,
        time: Date.now(),
        source: [user, instance.info.id, drops].flat(),
        description: `Dye ${drops} dropped in ${instance.info.id} and were collected by ${instance.info.owner}`,
    }
}

function DropEventInfo(event: Event) {
    console.assert(event.id === AlienDropEvent);
    let instance = getWorld().getInstanceById(event.source[1])!;
    return(
        <>
        Dye {event.source.slice(2).map((d:any) =><PaletteInfo paletteId={d} key={d}></PaletteInfo>)} 
        dropped in {instance.info.id} and were collected by {instance.info.owner}
        </>
        );
}

export interface EventInfoProps {
    event: Event;
}

export function EventInfo(props: EventInfoProps) {
    let event = props.event;
    if (event.id == AlienDropEvent) return DropEventInfo(event);
    else {
        return (<>{event.description}</>)
    }
}
