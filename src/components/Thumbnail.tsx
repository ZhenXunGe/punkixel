import React, { useState, useRef, useEffect } from 'react';
import { useAppSelector, useAppDispatch } from '../app/hooks';
import { toDyeColor } from '../data/palette';

import {
  selectWorld,
  selectTimeClock,
  selectSketchSignal,
  selectViewIndex,
} from '../data/statusSlice';

import { individualWidth } from "../data/draw";

export function Thumbnail() {
  const dispatch = useAppDispatch();
  const canvasRef = useRef<any>();
  const world = useAppSelector(selectWorld);
  const timeClock = useAppSelector(selectTimeClock);
  const sketchSignal = useAppSelector(selectSketchSignal);
  const viewIndex = useAppSelector(selectViewIndex);
  useEffect(() => {
    const canvas = canvasRef.current
    const context = canvas.getContext('2d')
    const render = (x:number, y:number, c:number) => {
      context.fillStyle = toDyeColor(c, timeClock);
      context.fillRect(x, (100-y), 1, 1);
    };
    world.rend(render, viewIndex*individualWidth);
  }, [viewIndex])

  useEffect(() => {
    const canvas = canvasRef.current
    const context = canvas.getContext('2d')
    const render = (x:number, y:number, c:number) => {
      context.fillStyle = toDyeColor(c, timeClock);
      context.fillRect(x, (100-y), 1, 1);
    };
    world.rend(render, viewIndex*individualWidth);
  }, [sketchSignal])

  return (
    <div className="thumbnail">
      <div className="content">
        <canvas height="100" width="900" ref={canvasRef} key="thumbnail-canvas">
        Drawer Drawer
        </canvas>
      </div>
    </div>
  );
}
