import React, { MutableRefObject, useEffect, useRef, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { selectPlayer } from '../../data/statusSlice';
import { Minion } from "../../data/minion";
import { ListGroup } from 'react-bootstrap';
import { getWorld } from '../../data/world';
import { Reroll, Unlock } from '../../modals/unlock';
import { getBulletFrame, getMinionFrame } from '../../sprite/spriteSlice';

import './style.scss';
import Inuse from '../../images/protectors/Inuse.png';
import Idle from '../../images/protectors/Idle.png';
import protector_modifier from '../../images/protectors/protector_tag.png';
import unknown from '../../images/protectors/unknown.png';
import hover4 from "../../images/layout/level_4.png";

interface single {
  mId: string | null;
  index: number;
}

export function SingleItem(m: single) {
  if (m.mId === null) {
    // let ufo = sprites.getFrame("default", 0).src;
    return (
      <div className='protector'>
        <div className='left'>
          <img className="avator" src={unknown}></img>
          <img className="modifier" src={protector_modifier} ></img>
        </div>
        <div className="right">
          <div className='item'>---</div>
          <div className='item'>---</div>
          {/* <div>mod: t</div> */}
        </div>
      </div>
    );
  } else {
    let minion = getWorld().getMinion(m.mId)!;
    let ufo = getMinionFrame (minion).src;
    console.log(minion.location);
    if (minion.location === null) {
      return (
        <div className='protector'>
          <div className='left'>
            <img className="avator" src={ufo}></img>

            <img className="modifier" src={getBulletFrame(minion.modifier[1]).src}></img>
          </div>
          <div className="right">
            <div className='item'>{minion.power}</div>
            <div className='item'>{minion.frequency}</div>
          </div>
        </div>
      );
    } else {
      return (
        <div className='protector'>
          <div className='left'>
            <img className="avator" src={ufo}></img>

            <img className="modifier" src={getBulletFrame(minion.modifier[1]).src}></img>
          </div>
          <div className="right">
            <div className='item'>{minion.power}</div>
            <div className='item'>{minion.frequency}</div>
          </div>
        </div>
      );
    }
  }
}

export function SingleItemBtn(m: single) {
  if (m.mId === null) {
    // let ufo = sprites.getFrame("default", 0).src;
    return (
        <Unlock avator={unknown} uid="solo" index={m.index} ></Unlock>
    );
  } else {
    let minion = getWorld().getMinion(m.mId)!;
    if (minion.location === null) {
      return (
        <div className='action'>
          <Reroll minion={minion} index={m.index}></Reroll>
          <img src={Idle}></img>
        </div>
      );
    } else {
      return (
        <div className='action'>
            <Reroll minion={minion} index={m.index}></Reroll>
            <img src={Inuse}></img>
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
  let ufo = getMinionFrame (minion).src;
  if (minion.location === null) {
    return (<ListGroup.Item onClick={() => m.setminion(m.mId)} href={"#" + minion.id}> <img src={ufo}></img> {minion.id} is now idling. [speed: {minion.power}] </ListGroup.Item>);
  } else {
    return (<ListGroup.Item disabled> <img src={ufo}></img> is now protecting block {minion.location}. [contribution:{minion.contribution} ] </ListGroup.Item>);
  }
}


export function MinionSelector(s: MinionSelector) {
  const player = useAppSelector(selectPlayer)!;
  const inventory = player.inventory;
  const [current, setCurrent] = useState("none");
  console.log('selector',inventory)
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
  const player = useAppSelector(selectPlayer)!;
  const inventory = player.inventory;
  return (
    <div className="inventory">
    <div className="inventory-content">
      {inventory.map((m, i) => {
        return <SingleItem mId={m} index={i} key={m == null ? `inventory-minion-${i}` : m}></SingleItem>
      })}
    </div>
    <img className="inventory-cover" src={hover4} ></img>
    <div className="inventory-btn">
    {inventory.map((m, i) => {
        return <SingleItemBtn mId={m} index={i} key={`btn-inventory-minion-${i}`}></SingleItemBtn>
      })
    }
    </div>
    </div>
  );
}


