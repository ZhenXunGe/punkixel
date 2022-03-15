import React, { useState, useRef, useEffect } from 'react';
import { useAppSelector, useAppDispatch } from '../app/hooks';
import 'bootstrap/dist/css/bootstrap.min.css';
import {
    individualWidth,
    individualHeight,
    drawWeather,
} from "../data/draw"
import { toDyeColor } from "../data/palette"

import {
  selectTimeClock,
  selectViewIndex,
} from '../dynamic/dynamicSlice';
import getWorld, { getBackground } from '../data/world';

import './Component.scss';

interface IProps {
}

export function WorldBoard (props: IProps) {

  let ratio = 4;

  const dispatch = useAppDispatch();
  const canvasRef = useRef<any>();
  const backRef = useRef<any>();
  const weatherRef = useRef<any>();
  const timeClock = useAppSelector(selectTimeClock);
  const viewIndex = useAppSelector(selectViewIndex);

  function clickEvent(e:any) {
    console.log(e.nativeEvent.offsetX/4, e.nativeEvent.offsetY/4);
  }

  useEffect(() => {
    const backref = backRef.current!;
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');
    const image = context.getImageData(0, 0, individualWidth*ratio, individualHeight*ratio)
    let painter = (x:number, y:number, c:number, alpha:number) => {
      let sx = x * ratio;
      let sy = y * ratio;
      let color = toDyeColor(c, timeClock);
      for (var px=sx; px<sx+ratio; px++) {
        for (var py=sy; py<sy+ratio; py++) {
          let index = ((100 * ratio - py) * individualWidth * ratio + px) * 4;
            image.data[index] = color[0];
            image.data[index+1] = color[1];
            image.data[index+2] = color[2];
            image.data[index+3] = alpha;
        }
      }
    };
    let drawer = getWorld().getInstance(viewIndex*individualWidth).drawer;
    drawer.draw(painter, viewIndex*individualWidth);
    context.putImageData(image,0,0);
    const instance = getWorld().getInstance(viewIndex);
    backref.style.backgroundImage = `url(${getBackground(instance.info.background)})`;
  }, [viewIndex, timeClock])

  useEffect(() => {
    const weather = weatherRef.current!;
    drawWeather(weather);
  }, [timeClock])


  return (
    <div className="main-board">
    <div className="drawer" onClick={(e) => {clickEvent(e);}} ref={backRef}>
    <canvas key="drawer-world-board" height="400" width={`${individualWidth*ratio}`} ref={canvasRef}>
        Drawer Drawer
    </canvas>
    <canvas key="weather-drawer" height="400" width={`${individualWidth * ratio}`} ref={weatherRef}>
      Weather Drawer
    </canvas>
    </div>
    </div>
  );
}
