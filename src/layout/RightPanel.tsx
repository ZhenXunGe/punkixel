import React, { useState } from 'react';

import { useAppSelector, useAppDispatch } from '../app/hooks';
import {
  selectPanel,
} from './layoutSlice';

import { HomePanel } from '../components/HomePanel';
import { WorldPanel } from '../components/WorldPanel';
import { VotePanel } from '../components/VotePanel';
import { MarketPanel } from '../components/MarketPanel';
import { Events } from '../components/Events';
import  More from '../modals/more'


import './style.scss';
import btm_left from '../images/bottom_left.png';
import btm_right from '../images/bottom_right.png';
import righttube from '../images/righttube.png';
import mid_left from '../images/mid_left.png';
import { selectUpcomingAlien } from '../dynamic/dynamicSlice';
import { getSprite } from '../sprite/spriteSlice';

function AlienInfo() {
  const alien = useAppSelector(selectUpcomingAlien);
  const sketch = getSprite(alien.sprite).getFrame("run", 0);
  return (<div>
    <div className="alien-basic">
      <div className="alien-basic-avator">
        <img src={sketch.src}></img>
      </div>
      <div className="alien-basic-info">
      <div className='skill'>
            <ul className='skills'>
              <li>1</li>
              <li>2</li>
              <li>3</li>
            </ul>
          </div>
          <p style={{color:'white',fontFamily:'monospace'}}>{alien.name}</p> 
          <div className="right">
        <div className='speed'>{alien.speed}</div>
        <div className='strack'>{alien.favourate}</div>
      </div>
        </div>
     
    </div>
    <div className='summary'>
    <div style={{color:'white'}}> {alien.name} from planet 0x3245 is about to arrive Z-city within arount 20 minutes </div>
    {/* <div> {alien.name} carries plenty of native rocks from planet 0x3245 which is the receipt of dye [#dye2] [#dye3]</div> */}
    {/* <button className='more'>
      </button> */}
      <More imgsrc={sketch.src} name={alien.name} description={`${alien.name} from planet 0x3245 is about to arrive Z-city within arount 20 minutes
      ${alien.name} carries plenty of native rocks from planet 0x3245 which is the receipt of dye [#dye2] [#dye3]`} speed={alien.speed} favourate={alien.favourate} ></More>
    </div>
  </div>);
}

export function RightPanel() {
  const panel = useAppSelector(selectPanel);
  return (
    <>
      {panel == "home" && <HomePanel key="home-panel" ></HomePanel>}
      {panel == "world" && <WorldPanel></WorldPanel>}
      {panel == "vote" && <VotePanel></VotePanel>}
      {panel == "market" && <MarketPanel></MarketPanel>}
      <Events></Events>
      <div className="alien-info">
        <AlienInfo></AlienInfo>
      </div>
      <div className="mid_left">
        <img src={mid_left}></img>
      </div>
      <div className='righttube'>
        <img src={righttube}></img>
      </div>
      <div className='bottom_left'>
        <img src={btm_left}></img>
      </div>
      <div className='bottom_right'>
        <img src={btm_right}></img>
      </div>
    </>
  );
}
