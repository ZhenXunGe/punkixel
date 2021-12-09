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

export function RightPanel() {
  const panel = useAppSelector(selectPanel);
  const dispatch = useAppDispatch();
  return (
    <>
    { panel == "home" && <HomePanel></HomePanel>}
    { panel == "world" && <WorldPanel></WorldPanel>}
    { panel == "vote" && <VotePanel></VotePanel>}
    { panel == "market" && <MarketPanel></MarketPanel>}
    </>
  );
}
