import React, { MutableRefObject, useEffect, useRef, useState } from 'react';
import { useAppDispatch } from '../app/hooks';
import { signalAlien } from '../dynamic/dynamicSlice';
import Frame from '../sprite/Frame';
import { getSprite } from '../sprite/spriteSlice';
export function AlienItem() {
  const dispatch = useAppDispatch();
  function attackEvent(e:any) {
    dispatch(signalAlien("dizzle"));
  }
  const canvasRef = useRef<HTMLCanvasElement>();
  const spriteMonster = getSprite("monster");
  const spriteUFO = getSprite("ufo");
  return (
  <>
    <Frame monster={spriteMonster} minion={spriteUFO} canvasRef={canvasRef}></Frame>
    <div className="animation" >
        <div className="body">
        <canvas onClick={(e) => {attackEvent(e);}} height="400" width="900" ref={e => {
          console.log("canvanref");
          canvasRef.current = e!
          }}>
            Drawer Drawer
        </canvas>
        </div>
    </div>
  </>
  );
}


