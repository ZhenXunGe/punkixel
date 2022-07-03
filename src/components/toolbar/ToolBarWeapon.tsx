import React, { useEffect, useState } from 'react';
import { useAppSelector } from '../../app/hooks';
import '../Component.scss';
import Contribute from "../../modals/contribute";
import 'bootstrap/dist/css/bootstrap.min.css';
import { individualWidth } from '../../data/draw';
import { getWorld } from '../../data/world';
import {
   selectTimeClock,
   selectViewIndex, selectDynamicSignal} from '../../dynamic/dynamicSlice';
import './style.scss';
import { getMinionFrame } from '../../sprite/spriteSlice';

interface IProps {
  mId:string;
}

export function MinionAvator(props:IProps) {
  let minion = getWorld().getMinion(props.mId);
  let minion_url = getMinionFrame(minion).src;
  return (<div className="minion-avator"><img src={minion_url} className="minion-avator"></img><div className="cover"></div></div>)
}


export function ToolBarWeapon() {
  const viewIndex = useAppSelector(selectViewIndex);
  const dynamic = useAppSelector(selectDynamicSignal);
  const minions = getWorld().getInstance(viewIndex * individualWidth).info.minions;
  const timeClock = useAppSelector(selectTimeClock);
  const [damage, setDamage] = useState(0);
  useEffect(() => {
    for (var m of minions) {
      setDamage(damage + getWorld().getMinion(m).power);
    }
  }, [dynamic])
  return (
    <div className="tool-bar" key={dynamic}>
      <ul>
        <li>
          <ul className="inline-brick world">
            <div className='minionList'>
              {minions.map((m) => {
                return (
                  <li className='minionItem' key={getWorld().getMinion(m).id}><MinionAvator  mId={m}></MinionAvator></li>
                );
              })}
            </div>
            <div className='minionDamage'>
              <li> {minions.length} minions are protecting this block. </li>
              <div>
                <li> Total Damage: {damage} </li>
                <li> Speed reduction: 10%</li>
              </div>

            </div>
          </ul>
          <Contribute></Contribute>
        </li>
      </ul>
    </div>
  );
}
