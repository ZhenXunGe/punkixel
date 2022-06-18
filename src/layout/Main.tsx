import React, { createRef, useEffect, useRef } from 'react';
import { useAppSelector, useAppDispatch } from '../app/hooks';
import { LeftMenu } from './LeftMenu';
import { RightPanel } from './RightPanel';
import { spriteIsLoaded, spriteNeedLoaded, spriteLoaded, spriteNumber, getSprite, setLoaded } from '../sprite/spriteSlice';
import { selectCursor, selectTimeClock, setCursor, updateTimeClockAsync } from '../dynamic/dynamicSlice';
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
import { Loading } from './Loading';
import { HandlerProxy } from './handlerProxy';


interface loadingStatus {
  totalSprites:number,
}

interface HoverProxyProps {
  proxy: HandlerProxy,
  ele: () => HTMLElement | null,

}
function HoverProxy(props: HoverProxyProps) {
  const cursorClass = useAppSelector(selectCursor);
  const dispatch = useAppDispatch();
  //const ratio = useAppSelector(selectRatio);

  return <div
  onClick={(e)=> {
    const ele = props.ele();
    if (ele) {
      props.proxy.clickHandler(e, ele);
    } else {
      console.log(ele);
    }
  }}
  onMouseMove={(e)=>{
    const ele = props.ele();
    if (ele) {
      let style = props.proxy.hoverHandler(e, ele);
      dispatch(setCursor(style));
      console.log(style);
    } else {
      return (ele);
    }
  }}
  onWheel={(e)=> {
    const ele = props.ele();
    if (ele) {
      props.proxy.scrollHandler(e, ele)
    } else {
      console.log("wheel");
    }
  }} className={`hover ${cursorClass}`}>
  </div>
}

export function Main(prop: loadingStatus) {
  const dispatch = useAppDispatch();
  useEffect(() => {
    setInterval(function () {dispatch(updateTimeClockAsync(0))}, 80);
  }, []);
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
      <Thumbnail></Thumbnail>
      <Status></Status>
      <Events></Events>
      <More></More>
      <Tool></Tool>
      </div>
    )
  } else {
    return (<Loading></Loading>);
  }
}
