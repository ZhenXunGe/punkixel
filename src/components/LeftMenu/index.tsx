import React, { useState } from 'react';

import { useAppSelector, useAppDispatch } from '../../app/hooks';
import {
  home,
  world,
  vote,
  market,
  selectPanel,
} from '../../layout/layoutSlice';

import  Inventory from "../Inventory"

import './style.scss';
import HOME_ACT from '../../images/buttons/home_act.png';
import WORLD_ACT from '../../images/buttons/world_act.png';
import RANK_ACT from '../../images/buttons/rank_act.png';
import MARKET_ACT from '../../images/buttons/market_act.png';

import HOME_UNACT from '../../images/buttons/home_unact.png';
import WORLD_UNACT from '../../images/buttons/world_unact.png';
import RANK_UNACT from '../../images/buttons/rank_unact.png';
import MARKET_UNACT from '../../images/buttons/market_unact.png';

export function LeftMenu() {
  const [currentpanel, setCurrentPanel] = useState('home');
  const dispatch = useAppDispatch();
  return (
    <div className="left-menu">
        <div className="padding-top"></div>
        <div className='avatorTop'>
 <div className='avatorContext'></div>
 <div className='avatorBorder'></div>
 </div>
        <div className="panelSelect">
        <button className={`button-icon ${
            'home' === currentpanel ? "active" : "unact"
          }`}  onClick={() => {setCurrentPanel('home');dispatch(home())}}>
          <img  src={currentpanel==='home' ? HOME_ACT:HOME_UNACT}></img>
        </button>
        <button className={`button-icon right ${
            'world' === currentpanel ? "active" : "unact"
          }`} onClick={() => {setCurrentPanel('world');dispatch(world())}}>
          <img src={currentpanel==='world' ? WORLD_ACT:WORLD_UNACT}></img>
        </button>
        <button className={`button-icon bottom ${
            'rank' === currentpanel ? "active" : "unact"
          }`} onClick={() => {setCurrentPanel('rank');dispatch(vote())}}>
          <img src={currentpanel==='rank' ? RANK_ACT:RANK_UNACT}></img>
        </button>
        <button className={`button-icon right bottom ${
            'market' === currentpanel ? "active" : "unact"
          }`} onClick={() =>{setCurrentPanel('market'); dispatch(market())}}>
          <img src={currentpanel==='market' ? MARKET_ACT:MARKET_UNACT}></img>
        </button>
        </div>
        <div style={{paddingTop:'19px'}}>
        <Inventory></Inventory>
        </div>
    </div>
  );
}
