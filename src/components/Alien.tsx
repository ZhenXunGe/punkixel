import React, { MutableRefObject, useEffect, useRef, useState } from 'react';
import { useAppDispatch } from '../app/hooks';
import {
  contribute, signalAlien,
} from '../data/statusSlice';
import Frame from '../sprite/Frame';
import { Sprite, LoadSprite } from '../sprite/sprite';
import { clips as MonsterClips} from "../sprite/monster/sprite";
import { clips as UFOClips} from "../sprite/ufo/sprite";
export function AlienItem() {
  const dispatch = useAppDispatch();
  function attackEvent(e:any) {
    dispatch(signalAlien("dizzle"));
    dispatch(contribute());
  }
  const imageEls = new Array(13);
  const canvasRef = useRef<HTMLCanvasElement>();
  const spriteMonster = new Sprite(2, 100, 80, 13, 0, 0, "run");
  const spriteUFO = new Sprite(2, 40, 40, 1, 0, 0, "default");
  return (
  <>
    <LoadSprite sprite={spriteMonster} height={100} width={80} clips={MonsterClips}></LoadSprite>
    <LoadSprite sprite={spriteUFO} height={40} width={40} clips={UFOClips}></LoadSprite>
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


