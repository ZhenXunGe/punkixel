import { PaletteInfo } from "../modals/palette";
import InfoBox from "../modals/info/index";
import RewardBox from "../modals/reward/index";
import './style.scss';
import ARTIST_ADVISOR_AVATOR from '../images/modal/advisor/artistadvisor.png';
import DEFIND_ADVISOR_AVATOR from '../images/modal/advisor/artistadvisor.png';
import { AlienAvator, DyeAvator, MinionAvator } from "../components/Events";
import { getSprite } from "../sprite/spriteSlice";
import { SysEvent } from "../server/types";
import { getWorld } from "../data/world";

export interface EventRender {
    event: SysEvent,
    info: () => JSX.Element;
}

const EventAdvice = 0x01;
const EventAlienEnter = 0x10;
const EventAlienKnock = 0x20;
const EventAlienDrop = 0x30;
const EventMinionProtecting = 0x11;

/* Advice Event will not be submitted to Server */
export function AdviceEventRender(advisor: string, brief: string, advice: string): EventRender {
    let event = {
        id: 0,
        tx: EventAdvice,
        time: Date.now(),
        source: [],
    };
    return {
        event: event,
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

export function AlienEventRender(event: SysEvent): EventRender {
    let monster = getWorld().getAlien(event.source[0].objId);
    let instance = getWorld().getInstance(parseInt(event.source[0].objId));
    const avatorurl = getSprite(monster.sprite).getFrame("run", 0).src;
    const description = `Alien ${monster.name} has entered block ${event.source[0].objId}`;
    const info = () => {
            return (
                <>
                <AlienAvator></AlienAvator>
                <div className="dropEvent">{description}
                    <InfoBox avator={avatorurl} hint={"details"} title={"Entered Instance"}>
                    </InfoBox>
                </div>
                </>
            );
        };
    return {
      event: event,
      info: info,
    };
}


export function ProtectingEventRender(event: SysEvent): EventRender {
    const playerId = event.source[0].objId;
    const minionId = event.source[1].objId;
    const instanceId = event.source[2].objId;
    const description = `Player ${playerId} has sent minion ${minionId} to protect block ${instanceId}`;
    const minion = getWorld().getMinion(minionId);
    return {
        event: event,
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

export function RewardEventRender(event: SysEvent): EventRender {
    let alienId = event.source[0].objId;
    let account = event.source[1].objId;
    let instanceId = event.source[2].objId;
    let instance = getWorld().getInstance(parseInt(instanceId));
    const description = `Alien ${alienId} was knocked in ${instanceId}, 100 punkxiels dropped`;
    console.log("rewards length:", event.source);
    return {
        event: event,
        info: () => {
            return (
            <>
            <AlienAvator></AlienAvator>
            <div className="dropEvent">{description}
               <RewardBox sources={event.source}></RewardBox>
            </div>
            </>);
        }
    }
}


export function DropEventRender(event: SysEvent): EventRender {
    let alienId = event.source[0].objId;
    let account = event.source[1].objId;
    let instanceId = event.source[2].objId;
    let instance = getWorld().getInstance(parseInt(instanceId));
    let dyeIndex = parseInt(event.source[3].objId);
    return {
        event: event,
        info: () => {
            return (
                <>
                <DyeAvator dyeIndex={15}></DyeAvator>
                <div className="dropEvent">
                    <span>Dye&nbsp;</span>
                    <PaletteInfo paletteIndex={dyeIndex} key={`dye-${dyeIndex}`}></PaletteInfo>
                    <span>&nbsp;dropped in {instanceId} and were collected by {instance.info.owner}</span>
                </div>
                </>
            );
        }
    }
}

export interface EventInfoProps {
    event: EventRender;
}

export function EventInfo(props: EventInfoProps) {
    return props.event.info();
}

export function makeEventRender(event: SysEvent) {
  if(event.tx === EventAlienEnter) {
    return AlienEventRender(event);
  } else if (event.tx === EventAlienKnock) {
    return RewardEventRender(event);
  } else if (event.tx === EventAlienDrop) {
    return DropEventRender(event);
  } else if (event.tx === EventMinionProtecting) {
    return ProtectingEventRender(event);
  } else {
    console.log(event);
    throw Error("Unknown Event for Event Render:" + event.id);
  }
}
