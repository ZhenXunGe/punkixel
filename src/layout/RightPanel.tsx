import React, { useState } from 'react';

import { useAppSelector, useAppDispatch } from '../app/hooks';
import {
  home,
  world,
  vote,
  market,
  selectPanel,
} from './layoutSlice';


import { HomePanel } from '../components/HomePanel';
import { WorldPanel } from '../components/WorldPanel';
import { VotePanel } from '../components/VotePanel';
import { MarketPanel } from '../components/MarketPanel';
import { Alert } from 'react-bootstrap';

export function RightPanel() {
  const panel = useAppSelector(selectPanel);
  return (
    <>
    { panel == "home" && <HomePanel key="home-panel" ></HomePanel>}
    { panel == "world" && <WorldPanel></WorldPanel>}
    { panel == "vote" && <VotePanel></VotePanel>}
    { panel == "market" && <MarketPanel></MarketPanel>}
    <div className ="guest-info">
    <Alert key='alarm-01' variant='danger' className="alarm" style={{margin:0}}>
    ALARM: Alain from XXXX is approaching and will land on Z City within 10 days
    </Alert>
    <Alert key='alarm-2' variant='success' className="alarm" style={{margin:0}}>
    News: A Visitor from Alien XXX drops a dye at AAAA'home, pixels are spawned as rewards to all contributers.
    </Alert>
    <Alert key='alarm-3' variant='info' className="alarm">
    News: A Visitor from Alien XXX drops a dye at AAAA'home, pixels are spawned as rewards to all contributers.
    </Alert>

    </div>
    </>
  );
}
