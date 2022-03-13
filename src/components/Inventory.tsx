import React, { MutableRefObject, useEffect, useRef, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../app/hooks';
import { selectInventory } from '../data/statusSlice';
import { Minion } from "../data/minion";
import { ListGroup } from 'react-bootstrap';
import getWorld from '../data/world';
import Unlock from '../modals/unlock';
import { getSprite } from '../sprite/spriteSlice';

interface single {
  mId: string | null;
  index: number;
}
export function SingleItem(m: single) {
  if (m.mId === null) {
    return (
      <div className="protector">
        <div className="left">
          <img src="FFF"></img>
          <Unlock uid="solo" index={m.index}></Unlock>
        </div>
        <div className="right">
          <div>power: ?</div>
          <div>speed: ?</div>
          <div>mod: ? </div>
        </div>
      </div>
    );
  } else {
    let minion = getWorld().getMinion(m.mId)!;
    let sprites = getSprite("ufo");
    let ufo = sprites.getFrame("default", minion.style).src;
    if (minion.location === null) {
      return (
        <div className="protector">
          <div className="left">
            <img src={ufo}></img>
            <div className="button">
              IDLE
            </div>
          </div>
          <div className="right">
            <div>power: {minion.power}</div>
            <div>speed: {minion.frequency}</div>
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
            <div>power: {minion.power}</div>
            <div>speed: {minion.frequency}</div>
            <div>mod: t</div>
          </div>
        </div>
      );
    }
  }
}


interface MinionSelector {
  setminion: (m: string) => void;
}

interface SingleSelect {
  setminion: (m: string) => void;
  mId: string;
}

export function SingleListItem(m: SingleSelect) {
  let minion = getWorld().getMinion(m.mId)!;
  let sprites = getSprite("ufo");
  let ufo = sprites.getFrame("default", minion.style).src;
  if (minion.location === null) {
    return (<ListGroup.Item onClick={() => m.setminion(m.mId)} href={"#" + minion.id}> <img src={ufo}></img> {minion.id} is now idling. [speed: {minion.power}] </ListGroup.Item>);
  } else {
    return (<ListGroup.Item disabled> <img src={ufo}></img> is now protecting block {minion.location}. [contribution:{minion.contribution} ] </ListGroup.Item>);
  }
}


export function MinionSelector(s: MinionSelector) {
  const inventory = useAppSelector(selectInventory);
  const [current, setCurrent] = useState("none");
  const setMinion = (mid: string) => {
    setCurrent(mid);
    s.setminion(mid);
  }
  return (<ListGroup className="minion-selector" defaultActiveKey={"#" + current}>
    {inventory.filter((m) => m !== null).map((m, i) => {
      return <SingleListItem setminion={setMinion} mId={m!} key={m!}></SingleListItem>
    })}
  </ListGroup>)
}

export default function Inventory() {
  const dispatch = useAppDispatch();
  const inventory = useAppSelector(selectInventory);
  return (
    <>
      {inventory.map((m, i) => {
        return <SingleItem mId={m} index={i} key={m == null ? `inventory-minion-${i}` : m}></SingleItem>
      })}
    </>
  );
}


