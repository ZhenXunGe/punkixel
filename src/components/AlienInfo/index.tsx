import React, { useState } from 'react';

import { useAppSelector, useAppDispatch } from '../../app/hooks';
import './style.scss';
import { selectUpcomingAlien } from '../../dynamic/dynamicSlice';
import { getSprite } from '../../sprite/spriteSlice';
import More from '../../modals/more';

export function AlienInfo() {
  const alien = useAppSelector(selectUpcomingAlien);
  //console.log("select Alien:", alien);
  const sketch = getSprite(alien.sprite).getFrame("run", 0);
  let h = (alien.knockDamage - alien.knockDamage % 100)/100;
  let m = alien.knockDamage%100;
  m = (m - m%10)/10;
  let l = alien.knockDamage % 10;
  return (
  <div className="alien-info">
    <div className="alien-basic">
      <div className="alien-basic-avator">
        <img src={sketch.src}></img>
      </div>
      <div className="alien-basic-info">
        <div className='skill'>
          <ul className='skills'>
            <li>{h}</li>
            <li>{m}</li>
            <li>{l}</li>
          </ul>
        </div>
        <div className="name">{alien.name}</div>
        <div className="right">
          <div className='speed'>{alien.speed}</div>
          <div className='strack'>{alien.favourate}</div>
        </div>
      </div>

    </div>
    <div className='summary'>
      <div> {alien.name} from planet 0x3245 is about to arrive Z-city within arount 20 minutes </div>
    </div>
  </div>);
}
