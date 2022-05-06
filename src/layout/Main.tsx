import React, { createRef, useEffect, useRef } from 'react';
import { useAppSelector, useAppDispatch } from '../app/hooks';
import { LeftMenu } from './LeftMenu';
import { RightPanel } from './RightPanel';
import { spriteIsLoaded, spriteNeedLoaded, spriteLoaded, spriteNumber, getSprite } from '../sprite/spriteSlice';
import { updateTimeClockAsync } from '../dynamic/dynamicSlice';
import getWorld from '../data/world';


import { Status } from '../components/Status';
import { Thumbnail } from '../components/Thumbnail';
import { Events } from '../components/Events';
import { Tool } from '../components/Tool';
import { AlienInfo} from '../components/AlienInfo';

import Inventory from '../components/Inventory';

import hover1 from "../images/layout/level_1.png";
import hover2 from "../images/layout/level_2.png";


import hover3 from "../images/layout/level_3.png";


import { getHandlerProxy, Hover } from './Hover';
import './style.scss';
import More from '../modals/more';


interface loadingStatus {
  totalSprites:number,
}
export function Main(prop: loadingStatus) {
  const dispatch = useAppDispatch();
  useEffect(() => {
    setInterval(function () {dispatch(updateTimeClockAsync(0))}, 80);
  }, []);
  const isloaded = useAppSelector(spriteIsLoaded);
  const loaded = useAppSelector(spriteLoaded);
  const needload = useAppSelector(spriteNeedLoaded);
  const total = useAppSelector(spriteNumber);
  const handlerProxy = getHandlerProxy();
  const handlerProxyRef = createRef<HTMLDivElement>();

/*

*/
  if(isloaded === true && getWorld()!=undefined && total === prop.totalSprites) {
    return (
      <div className="application" ref={handlerProxyRef} >
      <RightPanel key="right-panel" handlerProxy={handlerProxy}></RightPanel>
      <Hover bgurl={hover1}></Hover>

      <Hover bgurl={hover2}></Hover>
      <LeftMenu handlerProxy={handlerProxy}></LeftMenu>
      <AlienInfo></AlienInfo>
      <Hover bgurl={hover3}></Hover>
      <div onClick={(e)=>handlerProxy.clickHandler(e, handlerProxyRef.current!)} className="hover"></div>
      <Inventory></Inventory>
      <Thumbnail></Thumbnail>
      <Status></Status>
      <Events></Events>
      <More></More>
      <Tool></Tool>
      </div>
    )
  } else {
    return(<div>loading {loaded} {needload}</div>);
  }
}
/*
      <AlienInfo></AlienInfo>




      */