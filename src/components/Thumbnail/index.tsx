import React, { useState, useRef, useEffect } from 'react';
import { useAppSelector, useAppDispatch } from '../../app/hooks';
import { toDyeColor } from '../../data/palette';
import {
    individualWidth,
} from "../../data/draw"
import { selectAlien, selectSketchSignal, selectTimeClock, selectViewIndex } from '../../dynamic/dynamicSlice';
import getWorld from '../../data/world';
import FRAME from '../../images/layout/frame.png';
import './style.scss';
export function Thumbnail() {
  let ratio = 1;

  const dispatch = useAppDispatch();
  const canvasRef = useRef<any>();
  const sketchSignal = useAppSelector(selectSketchSignal);
  const viewIndex = useAppSelector(selectViewIndex);
  const alien = useAppSelector(selectAlien);
  const timeClock = useAppSelector(selectTimeClock);
  let offset = 0;
  useEffect(() => {
    const canvas = canvasRef.current
    const context = canvas.getContext('2d')
    const image = context.getImageData(0, 0, canvas.width, canvas.height)
    let painter = (x:number, y:number, c:number, alpha:number) => {
      let sx = x * ratio;
      let sy = y * ratio;
      let color = toDyeColor(c, 0);
      for (var px=sx; px<sx+ratio; px++) {
        for (var py=sy; py<sy+ratio; py++) {
          let index = ((100 * ratio - py) * canvas.width + px) * 4;
            image.data[index] = color[0];
            image.data[index+1] = color[1];
            image.data[index+2] = color[2];
            image.data[index+3] = alpha;
        }
      }
    };
    let start = Math.floor(alien.pos/individualWidth) - 2
    let end = start + 3;

    getWorld().rend(painter, start, end, alien.pos-individualWidth*2);
    context.putImageData(image,0,0);
  }, [viewIndex, timeClock, sketchSignal])

  return (
    <div className="thumbnail">
      <div className="content">
        <canvas height="100" width={`${individualWidth*4}`} ref={canvasRef} key="thumbnail-canvas">
        Drawer Drawer
        </canvas>
      </div>
      <div className="frame">
        <img src={FRAME}></img>
      </div>
    </div>
  );
}
