import React, { MutableRefObject, useEffect, useRef, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../app/hooks';
import { selectInventory } from '../data/statusSlice';
import { Minion } from "../data/minion";
import ufo from "../sprite/ufo/ufo.png";
import { ListGroup } from 'react-bootstrap';

interface single {
  minion:Minion | null;
}
export function SingleItem(m:single){
  if (m.minion === null) {
    return (
      <div className="protector">
        <div className="left">
        <img src={ufo}></img>
        <div className="button">
          UNLOCK
        </div>
        </div>
        <div className="right">
          <div>power: ?</div>
          <div>speed: ?</div>
          <div>mod: ? </div>
        </div>
      </div>
    );
  } else if ( m.minion.location === null) {
    return (
    <div className="protector">
      <div className="left">
        <img src={ufo}></img>
        <div className="button">
          IDLE
        </div>
      </div>
      <div className="right">
          <div>power: {m.minion.power}</div>
          <div>speed: {m.minion.frequency}</div>
          <div>mod: t </div>
      </div>
    </div>
    );
  } else {
    return (
      <div className="protector">
        <div className="left">
          <img src={ufo}></img>
          <div className="button">
            INUSE
          </div>
        </div>
        <div className="right">
          <div>power: {m.minion.power}</div>
          <div>speed: {m.minion.frequency}</div>
          <div>mod: t</div>
        </div>
      </div>
    );
  }
}


interface MinionSelector {
  setminion: (m:string) => void;
}

interface SingleSelect {
  setminion: (m:string) => void;
  minion: Minion;
}

export function SingleListItem(m:SingleSelect) {
  if ( m.minion.location === null) {
    return (<ListGroup.Item onClick={()=>m.setminion(m.minion.id)}  href={"#" + m.minion.id}> <img src={ufo}></img> {m.minion.id} is now idling. [speed: {m.minion.power}] </ListGroup.Item>);
  } else {
    return (<ListGroup.Item disabled> <img src={ufo}></img> is now protecting block {m.minion.location}. </ListGroup.Item>);
  }
}


export function MinionSelector(s:MinionSelector) {
  const inventory = useAppSelector(selectInventory);
  const [current, setCurrent] = useState("none");
  const setMinion = (mid:string) => {
    setCurrent(mid);
    s.setminion(mid);
  }
  return (<ListGroup className="minion-selector" defaultActiveKey={"#" + current}>
    {inventory.filter((m) => m!==null).map((m,i) => {
    return <SingleListItem setminion={setMinion} minion={m!} key={m!.id}></SingleListItem>
    })}
  </ListGroup>)
}

export default function Inventory() {
  const dispatch = useAppDispatch();
  const inventory = useAppSelector(selectInventory);
  return (
  <>
    {inventory.map((m,i) => {
      return <SingleItem minion={m} key={m==null? `inventory-minion-${i}` : m.id}></SingleItem>
    })}
  </>
  );
}


