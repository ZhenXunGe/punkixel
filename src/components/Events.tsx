import { Alert } from 'react-bootstrap';
import { useAppSelector } from '../app/hooks';
import { selectEvents } from '../dynamic/dynamicSlice';
import { EventInfo } from '../dynamic/event';
import { selectPanel } from '../layout/layoutSlice';

import alien from "../sprite/monster/run/skeleton-03_run_00.png";

export function AlienAvator() {
    return (<div className="minion-avator"><img src={alien} className="minion-avator"></img></div>)
}

export function Events() {
  const events = useAppSelector(selectEvents);
  return (
    <div className ="guest-info">
    {events.slice(0,3).map((e,i) =>
        <div key={`event-${i}`} className="event">
          <AlienAvator></AlienAvator> <EventInfo event={e}></EventInfo> {e.time}
        </div>
    )}
    </div>
  );
}

