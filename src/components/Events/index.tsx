import { useAppSelector } from '../../app/hooks';
import "./style.scss";
import dyeavator from "../../images/buttons/dyebottle.png";
import { selectAlien, selectEvents } from '../../dynamic/dynamicSlice';
import { EventInfo } from '../../dynamic/event';
import { getSprite, getMinionFrame } from '../../sprite/spriteSlice';
import { Minion } from '../../server/types';
import { makeEventRender } from '../../dynamic/event';

export function AlienAvator() {
  const alien = useAppSelector(selectAlien);
  const sketch = getSprite(alien.sprite).getFrame("run", 0);
    return (<div className="minion-avator"><img src={sketch.src} className="minion-avator"></img></div>)
}

interface MinionAvatorProp {
  minion: Minion;
}
export function MinionAvator(props: MinionAvatorProp) {
  let minion = props.minion;
  let ufo = getMinionFrame(minion).src;
  return (<div className="minion-avator"><img src={ufo} className="minion-avator"></img></div>)
}

interface DyeAvatorProp {
  dyeIndex: number;
}

export function DyeAvator(props: DyeAvatorProp) {
  return (<div className="minion-avator"><img src={dyeavator} className="minion-avator"></img></div>)
}

export function Events() {
  const events = useAppSelector(selectEvents);
  return (
    <div className ="guest-info">
    {events.slice(0,3).map((e,i) =>
        <div key={`event-${i}`} className="event">
          <EventInfo event={makeEventRender(e)}></EventInfo>
           {/* {e.time} */}
        </div>
    )}
    </div>
  );
}

