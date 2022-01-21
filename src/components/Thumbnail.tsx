import React, { useState, useRef, useEffect } from 'react';
import { useAppSelector, useAppDispatch } from '../app/hooks';

import {
  selectWorld,
} from '../data/statusSlice';

export function Thumbnail() {
  const dispatch = useAppDispatch();
  const canvasRef = useRef<any>();
  const world = useAppSelector(selectWorld);
  useEffect(() => {
    const canvas = canvasRef.current
    const context = canvas.getContext('2d')
    const render = (x:number, y:number, c:string) => {
      context.fillStyle = c;
      context.fillRect(x, (100-y), 1, 1);
    };
    world.rend(render, 4);
  }, [])

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
