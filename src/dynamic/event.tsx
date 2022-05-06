
import { Alien } from "../data/alien";
import { Instance } from "../data/instance";
import PaletteInfo from "../modals/palette";
import InfoBox from "../modals/info/index";
import './style.scss';
import { Minion } from "../data/minion";

import ARTIST_ADVISOR_AVATOR from '../images/modal/advisor/artistadvisor.png';
import DEFIND_ADVISOR_AVATOR from '../images/modal/advisor/artistadvisor.png';
import { AlienAvator, DyeAvator, MinionAvator } from "../components/Events";
import { fromDrop } from "../data/palette";
import RewardBox from "../modals/reward"
import { getSprite } from "../sprite/spriteSlice";

export interface Event {
    id: number;
    tx: number;
    time: number;
    source: any;
    info: () => JSX.Element;
}

const EventAdvice = 0x01;
const EventAlienMove = 0x10;
const EventAlienKnock = 0x20;
const EventAlienDrop = 0x30;
const EventMinionProtecting = 0x11;

export function AdviceEvent(advisor: string, brief: string, advice: string) {
    return {
        id: EventAdvice,
        tx: 0,
        time: Date.now(),
        source: null,
        info: () => {
            return (
                <>
                <AlienAvator></AlienAvator>
                <div className="dropEvent">{advisor}: {brief}
                <InfoBox avator={ARTIST_ADVISOR_AVATOR} hint={"details"} title={advisor}>{(<div>{advice}</div>)}</InfoBox></div>
                </>
            );
        }        
    }
}

export function AlienEvent(monster: Alien, instance: Instance) {
    const description = `Alien ${monster.name} has entered block ${instance.info.id}`;
    const avatorurl = getSprite(monster.sprite).getFrame("run", 0).src;
    return {
        id: EventAlienMove,
        tx: 0,
        time: Date.now(),
        source: monster,
        info: () => {
            return (
                <>
                <AlienAvator></AlienAvator>
                <div className="dropEvent">{description}
                    <InfoBox avator={avatorurl} hint={"details"} title={"Corssing Block"}>
                    </InfoBox>
                </div>
                </>
            );
        }
    }
}


export function ProtectingEvent(user: string, instance: Instance, minion:Minion): Event {
    const description = `Alien ${user} has sent minion to protect block ${instance.info.id}`;
    return {
        id: EventMinionProtecting,
        tx: 0,
        time: Date.now(),
        source: user,
        info: () => {
            return (
                <>
                <MinionAvator minion={minion}></MinionAvator>
                <div className="dropEvent">{description}</div>
                </>
            );
        }
    }
}

interface MinionRewardInfo {
    minion: Minion;
    amount: number;
}
export interface RewardInfo {
    reserve: number;
    rewards: Array<MinionRewardInfo>;
}

export function RewardEvent(user: string, instance: Instance, info: RewardInfo): Event {
    const description = `Alien ${user} was knocked in ${instance.info.id}, 100 punkxiels dropped`;
    console.log("rewards length:", info.rewards);
    return {
        id: EventAlienKnock,
        tx: 0,
        time: Date.now(),
        source: user,
        info: () => {
            return (
            <>
            <AlienAvator></AlienAvator>
            <div className="dropEvent">{description}
                <RewardBox info={info}></RewardBox>
            </div>
            </>);
        }
    }
}


export function DropEvent(user: string, instance: Instance, drops: string[]): Event {
    const event = {
        id: EventAlienDrop,
        tx: 0,
        time: Date.now(),
        source: [user, instance.info.id, drops].flat(),
    }
    return {
        ...event,
        info: () => {
            return (
                <>
                <DyeAvator dyeIndex={15}></DyeAvator>
                <div className="dropEvent">
                    <span>Dye&nbsp;</span>{event.source.slice(2).map((d: any) => <PaletteInfo paletteId={d} key={d}></PaletteInfo>)}
                    <span>&nbsp;dropped in {instance.info.id} and were collected by {instance.info.owner}</span>
                </div>
                </>
            );
        }
    }
}

export interface EventInfoProps {
    event: Event;
}

export function EventInfo(props: EventInfoProps) {
    return props.event.info();
}
