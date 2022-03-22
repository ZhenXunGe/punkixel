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
      <div className="right">
        <div> Speed: {alien.speed}</div>
        <div> Attracted by: {alien.favourate} </div>
      </div>
    </div>
    <div> {alien.name} from planet 0x3245 is about to arrive Z-city within arount 20 minutes </div>
    <div> {alien.name} carries plenty of native rocks from planet 0x3245 which is the receipt of dye [#dye2] [#dye3]</div>
  </div>);
}

export function RightPanel() {
  const panel = useAppSelector(selectPanel);
  return (
    <>
    { panel == "home" && <HomePanel key="home-panel" ></HomePanel>}
    { panel == "world" && <WorldPanel></WorldPanel>}
    { panel == "vote" && <VotePanel></VotePanel>}
    { panel == "market" && <MarketPanel></MarketPanel>}
    <Events></Events>
    <div className="alien-info">
      <AlienInfo></AlienInfo>
    </div>
    </>
  );
}
