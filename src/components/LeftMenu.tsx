import React, { useState } from 'react';

import { useAppSelector, useAppDispatch } from '../app/hooks';
import {
  home,
  world,
  vote,
  market,
  selectPanel,
} from '../layout/layoutSlice';

import Inventory from "./Inventory"

import './Component.css';

export function LeftMenu() {
  const dispatch = useAppDispatch();
  return (
    <div className="left-menu">
        <div className="padding-top"></div>
        <div className="staking"></div>
        <button onClick={() => dispatch(home())}> H </button>
        <button onClick={() => dispatch(world())}> W </button>
        <button onClick={() => dispatch(vote())}> R </button>
        <button onClick={() => dispatch(market())}> M </button>
        <Inventory></Inventory>
    </div>
  );
}
