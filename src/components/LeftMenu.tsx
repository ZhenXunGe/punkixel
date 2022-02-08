import React, { useState } from 'react';

import { useAppSelector, useAppDispatch } from '../app/hooks';
import {
  home,
  world,
  vote,
  market,
  selectPanel,
} from '../layout/layoutSlice';

import './Component.css';

export function LeftMenu() {
  const dispatch = useAppDispatch();
  return (
    <div className="left-menu">
        <div className="padding-top"></div>
        <div className="staking"></div>
        <button onClick={() => dispatch(home())}> Home </button>
        <button onClick={() => dispatch(world())}> World </button>
        <button onClick={() => dispatch(vote())}> Ranking </button>
        <button onClick={() => dispatch(market())}> Market </button>
    </div>
  );
}
