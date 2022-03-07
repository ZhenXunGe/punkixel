import React, { useState, useRef, useEffect } from 'react';
import { useAppSelector, useAppDispatch } from '../app/hooks';
import 'bootstrap/dist/css/bootstrap.min.css';
import {
    individualWidth,
    individualHeight,
} from "../data/draw"
import { toDyeColor } from "../data/palette"

import {
  selectTimeClock,
  selectViewIndex,
} from '../dynamic/dynamicSlice';
import getWorld from '../data/world';


interface IProps {
}

export function WorldBoard (props: IProps) {

  let ratio = 4;

  const dispatch = useAppDispatch();
  const canvasRef = useRef<any>();
  const timeClock = useAppSelector(selectTimeClock);
  const viewIndex = useAppSelector(selectViewIndex);

  function clickEvent(e:any) {
    console.log(e.nativeEvent.offsetX/4, e.nativeEvent.offsetY/4);
  }

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');
    const image = context.getImageData(0, 0, individualWidth*ratio, individualHeight*ratio)
    let painter = (x:number, y:number, c:number) => {
      let sx = x * ratio;
      let sy = y * ratio;
      let color = toDyeColor(c, timeClock);
      for (var px=sx; px<sx+ratio; px++) {
        for (var py=sy; py<sy+ratio; py++) {
          let index = ((100 * ratio - py) * individualWidth * ratio + px) * 4;
            image.data[index] = color[0];
            image.data[index+1] = color[1];
            image.data[index+2] = color[2];
            image.data[index+3] = 255;
        }
      }
    };
    let drawer = getWorld().getInstance(viewIndex*individualWidth).drawer;
    drawer.draw(painter, viewIndex*individualWidth);
    context.putImageData(image,0,0);
  }, [viewIndex, timeClock])

  return (
    <div className="main-board">
    <div className="drawer" onClick={(e) => {clickEvent(e);}}>
    <canvas key="drawer-world-board" height="400" width={`${individualWidth*ratio}`} ref={canvasRef}>
        Drawer Drawer
    </canvas>
    </div>
    </div>
  );
}
