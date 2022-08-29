import { ToolBarDye } from './toolbar/ToolBarDye';
import React, { MutableRefObject, useEffect, useRef, useState } from 'react';
import { ToolBarWeapon } from './toolbar/ToolBarWeapon';
import { ToolBarMarket } from './toolbar/ToolBarMarket';
import { useAppDispatch, useAppSelector } from '../app/hooks';
import { selectPanel } from '../layout/layoutSlice';
import { getSprite } from '../sprite/spriteSlice';
import { getWorld } from '../data/world';
import { signalSketch } from '../dynamic/dynamicSlice';
import { RankTop } from './toolbar/RankTop';

import { selectL1Account } from "../data/accountSlice";



export interface DrawerConfig {
  canvasRef: MutableRefObject<HTMLCanvasElement | undefined>
}

export function Tool() {
  const panel = useAppSelector(selectPanel);
  const canvasRef = useRef<HTMLCanvasElement>();
  const dispatch = useAppDispatch();
  const account = useAppSelector(selectL1Account)!.address;

  useEffect(() => {
    const spriteSketch = getSprite("sketch");
    if (canvasRef.current /*&& getWorld().initSketch()*/) {
      for (var i = 0; i < getWorld().instances.length; i++) {
        let instance = getWorld().getInstanceByIndex(i);
        if (instance.info.sketched == false) {
          let d = instance.drawer;
          d.resetSketch();
          d.sketchWithStyle(canvasRef.current, spriteSketch, "building", "road");
          if (instance.info.owner === account) {
            getWorld().drawInstance(account, instance.info);
          }
        }
      }
      dispatch(signalSketch());
    }
  }, [canvasRef]);
  return (
    <>
          <div className="hide">
        <canvas height="100" width="300" ref={e => {
            canvasRef.current = e!
        }}>
        </canvas>
      </div>
      {panel === "world" && <ToolBarWeapon></ToolBarWeapon>}
      {panel === "home" && <ToolBarDye canvasRef={canvasRef}></ToolBarDye>}
      {panel === "market" && <ToolBarMarket></ToolBarMarket>}
      {panel === "rank" && <RankTop></RankTop>}
    </>
  );
}
