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

import alien from "../sprite/monster/run/skeleton-03_run_00.png";

import './style.scss';
import btm_left from '../images/bottom_left.png';
import btm_right from '../images/bottom_right.png';

function AlienInfo() {
  return (<div>
    <div className="alien-basic">
      <div className="alien-basic-avator">
        <img src={alien}></img>
      </div>
      <div className="right">
        <div> Speed: 200</div>
        <div> Attracted by: night view</div>
      </div>
    </div>
    <div> Gru02 from planet 0x3245 is about to arrive Z-city within arount 20 minutes </div>
    <div> Gru02 carries plenty of native rocks from planet 0x3245 which is the receipt of dye [#dye2] [#dye3]</div>
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
    <div className='bottom_left'>
      <img src={btm_left}></img>
    </div>
    <div className='bottom_right'>
      <img src={btm_right}></img>
    </div>
    </>
  );
}
