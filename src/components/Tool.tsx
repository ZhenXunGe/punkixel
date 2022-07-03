import { ToolBarDye } from './toolbar/ToolBarDye';
import React, { MutableRefObject, useEffect, useRef, useState } from 'react';
import { ToolBarWeapon } from './toolbar/ToolBarWeapon';
import { useAppDispatch, useAppSelector } from '../app/hooks';
import { selectPanel } from '../layout/layoutSlice';
import { getSprite } from '../sprite/spriteSlice';
import { getWorld } from '../data/world';
import { individualWidth } from '../data/draw';
import { signalSketch } from '../dynamic/dynamicSlice';
import { RankTop } from './toolbar/RankTop';



export interface DrawerConfig {
  canvasRef: MutableRefObject<HTMLCanvasElement | undefined>
}

export function Tool() {
  const panel = useAppSelector(selectPanel);
  const canvasRef = useRef<HTMLCanvasElement>();
  const dispatch = useAppDispatch();

  useEffect(() => {
    const spriteSketch = getSprite("sketch");
    if (canvasRef.current /*&& getWorld().initSketch()*/) {
      for (var i = 0; i < getWorld().instances.length; i++) {
        let d = getWorld().getInstance(i * individualWidth).drawer;
        d.resetSketch();
        d.sketchWithStyle(canvasRef.current, spriteSketch, "building", "road");
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
      {panel === "rank" && <RankTop></RankTop>}
    </>
  );
}
