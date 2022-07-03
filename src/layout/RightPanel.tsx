import React, { useState } from 'react';

import { useAppSelector, useAppDispatch } from '../app/hooks';
import {
  selectPanel,
} from './layoutSlice';

import { HomePanel } from '../components/HomePanel';
import { WorldPanel } from '../components/WorldPanel';
import { RankPanel } from '../components/Rank';
import { MarketPanel } from '../components/MarketPanel';
import { HandlerProxy } from './handlerProxy';

interface RightPanelProp {
  handlerProxy: HandlerProxy;
}

export function RightPanel(props: RightPanelProp) {
  const panel = useAppSelector(selectPanel);
  return (
    <>
      {panel == "home" && <HomePanel key="home-panel" handlerProxy={props.handlerProxy} ></HomePanel>}
      {panel == "world" && <WorldPanel key="world-panel" handlerProxy={props.handlerProxy}></WorldPanel>}
      {panel == "market" && <MarketPanel key="world-panel" handlerProxy={props.handlerProxy}></MarketPanel>}
      {panel == "rank" && <RankPanel key="rank-panel" handlerProxy={props.handlerProxy}></RankPanel>}
    </>
  );
}
