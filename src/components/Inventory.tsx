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
    return (<div className="protector"> <img src={ufo}></img> Not own yet. </div>);
  } else if ( m.minion.location === null) {
    return (<div className="protector"> <img src={ufo}></img> is now idling. </div>);
  } else {
    return (<div className="protector"> <img src={ufo}></img> is now protecting home {m.minion.location}. </div>);
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
    return (<ListGroup.Item onClick={()=>m.setminion(m.minion.id)}> <img src={ufo}></img> {m.minion.id} is now idling. [speed: {m.minion.speed}] </ListGroup.Item>);
  } else {
    return (<ListGroup.Item> <img src={ufo}></img> is now protecting home {m.minion.location}. </ListGroup.Item>);
  }
}


export function MinionSelector(s:MinionSelector) {
  const inventory = useAppSelector(selectInventory);
  return (<ul className="list-group minion-selector">
    {inventory.filter((m) => m!==null).map((m,i) => {
    return <SingleListItem setminion={s.setminion} minion={m!} key={m!.id}></SingleListItem>
    })}
  </ul>)
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


