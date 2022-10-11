import React, { createRef, useEffect, useRef } from 'react';
import { useAppSelector, useAppDispatch } from '../app/hooks';
import Dialog from './Dialog';
import { LeftMenu } from './LeftMenu';
import { RightPanel } from './RightPanel';
import { spriteIsLoaded, spriteNeedLoaded, spriteLoaded, spriteNumber, getSprite, setLoaded } from '../sprite/spriteSlice';
import { selectCursor, updateDynamic, setCursor, updateTimeClockAsync } from '../dynamic/dynamicSlice';
import { getWorld } from '../data/world';


import { Status } from '../components/Status';
import { Thumbnail } from '../components/Thumbnail';
import { Events } from '../components/Events';
import { Tool } from '../components/Tool';
import { AlienInfo} from '../components/AlienInfo';

import Inventory from '../components/Inventory';

import hover1 from "../images/layout/level_1.png";
import hover2 from "../images/layout/level_2.png";
import hover3 from "../images/layout/level_3.png";


import { getHandlerProxy, Hover, HoverProxy} from './Hover';
import './style.scss';
import More from '../modals/more';
import { Loading } from './Loading';

import {
  selectL1Account,
} from "../data/accountSlice";

interface loadingStatus {
  totalSprites:number,
}

export function Main(prop: loadingStatus) {
  const dispatch = useAppDispatch();
  let account = useAppSelector(selectL1Account);
  useEffect(() => {
    if(account) {
      setInterval(function () {dispatch(updateTimeClockAsync(0))}, 80);
      setInterval(function () {
        if (getWorld().timestamp > 0) {
          dispatch(updateDynamic(account!.address))
        }
      }, 2000);
    }
  }, [account]);
  const isloaded = useAppSelector(spriteIsLoaded);

  const total = useAppSelector(spriteNumber);
  const handlerProxy = getHandlerProxy();
  const handlerProxyRef = useRef(null);
  function getRef(): HTMLDivElement | null {
    if (handlerProxyRef.current) {
      return handlerProxyRef.current!;
    } else {
      return null;
    }
  }
  if(isloaded === true && getWorld()!=undefined && total === prop.totalSprites) {
    return (
      <div className="application" ref={handlerProxyRef} >
      <RightPanel key="right-panel" handlerProxy={handlerProxy}></RightPanel>
      <Hover bgurl={hover1}></Hover>

      <Hover bgurl={hover2}></Hover>
      <LeftMenu handlerProxy={handlerProxy}></LeftMenu>
      <AlienInfo></AlienInfo>
      <Hover bgurl={hover3}></Hover>
      <HoverProxy proxy={handlerProxy} ele={getRef}></HoverProxy>
      <Inventory></Inventory>
      <Thumbnail></Thumbnail>;
      <Status></Status>
      <Events></Events>
      <More></More>
      <Dialog></Dialog>
      <Tool></Tool>
      </div>
    )
  } else {
    return (<Loading></Loading>);
  }
}
