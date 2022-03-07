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
        <button className="button-left" onClick={() => dispatch(home())}> Home </button>
        <button className="button-right" onClick={() => dispatch(world())}> World </button>
        <button className="button-left" onClick={() => dispatch(vote())}> Rank </button>
        <button className="button-right" onClick={() => dispatch(market())}> Market </button>
        <Inventory></Inventory>
    </div>
  );
}
