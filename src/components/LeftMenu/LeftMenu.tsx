import React, { useState } from 'react';

import { useAppSelector, useAppDispatch } from '../../app/hooks';
import {
  home,
  world,
  vote,
  market,
  selectPanel,
} from '../../layout/layoutSlice';

import Inventory from "../Inventory"

import './style.scss';

export function LeftMenu() {
  const dispatch = useAppDispatch();
  return (
    <div className="left-menu">
        <div className="padding-top"></div>
        <div className='avator'>
 <div className='avatorContext'></div>
 <div className='avatorBorder'></div>
 </div>
        {/* <div className="staking"></div> */}
        {/* <div className='avator'></div> */}
        <div className="panelSelect">
        <button className="button-left home"  onClick={() => dispatch(home())}> Home </button>
        <button className="button-right world" onClick={() => dispatch(world())}> World </button>
        <button className="button-left rank" onClick={() => dispatch(vote())}> Rank </button>
        <button className="button-right market" onClick={() => dispatch(market())}> Market </button>
        </div>
        <Inventory></Inventory>
    </div>
  );
}
