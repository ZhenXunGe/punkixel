import React, { MutableRefObject, useEffect, useRef, useState } from 'react';
import { useAppDispatch } from '../app/hooks';
import { signalAlien } from '../dynamic/dynamicSlice';
import Frame from '../sprite/Frame';
import { getSprite } from '../sprite/spriteSlice';
export function AlienItem() {
  const dispatch = useAppDispatch();
  const canvasRef = useRef<HTMLCanvasElement>();
  const spriteMonster = getSprite("monster");
  const spriteUFO = getSprite("ufo");
  return (
  <>
    <Frame monster={spriteMonster} minion={spriteUFO} canvasRef={canvasRef}></Frame>
    <div className="animation" >
        <div className="body">
        <canvas height="400" width="1000" ref={e => {
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


