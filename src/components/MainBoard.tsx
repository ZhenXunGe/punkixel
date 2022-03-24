import React, { useState, useRef, useEffect } from 'react';
import { useAppSelector, useAppDispatch } from '../app/hooks';
import { Button, DropdownButton, Dropdown } from 'react-bootstrap';
import { Dye, ofDyeIndex, IsNillDye, toDyeColor } from "../data/palette";
import 'bootstrap/dist/css/bootstrap.min.css';
import {
    individualWidth,
    individualHeight,
    getCorIndex, ofCorIndex, drawWeather,
} from "../data/draw"

import {
    selectDye,
    selectHomeIndex,
    updatePPH,
} from '../data/statusSlice';

import {
  selectSketchSignal,
  selectTimeClock, signalSketch,
} from '../dynamic/dynamicSlice';
import getWorld, { getBackground } from '../data/world';

interface IProps {
}

export function PunkxielDrawer(props: IProps) {

  let ratio = 4;

  const dispatch = useAppDispatch();
  const canvasRef = useRef<any>();
  const backRef = useRef<any>();
  const weatherRef = useRef<any>();
  const pickedDye = useAppSelector(selectDye);
  const homeIndex = useAppSelector(selectHomeIndex);
  const timeClock = useAppSelector(selectTimeClock);
  const sketchSignal = useAppSelector(selectSketchSignal);

  function drawEvent(e:any) {
    var x = Math.floor(e.nativeEvent.offsetX/4);
    var y = Math.floor(e.nativeEvent.offsetY/4);
    let drawer = getWorld().getInstance(homeIndex*individualWidth).drawer;
    let [delta, cost] = drawer.pushPixelDelta(getCorIndex(x,100-y), pickedDye);
    dispatch(signalSketch());
    dispatch(updatePPH({delta:delta, cost:cost}));
  }

  useEffect(() => {
    const backref = backRef.current!;
    const canvas = canvasRef.current;
    const weather = weatherRef.current;
    const context = canvas.getContext('2d');
    const image = context.getImageData(0, 0, individualWidth*ratio, individualHeight*ratio);
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
    let drawer = getWorld().getInstance(homeIndex*individualWidth).drawer;
    drawer.draw(painter, homeIndex*individualWidth);
    context.putImageData(image,0,0);
    const instance = getWorld().getInstance(homeIndex);
    backref.style.backgroundImage = `url(${getBackground(instance.info.background)})`;
  }, [sketchSignal, timeClock])

  useEffect(() => {
    const weather = weatherRef.current!;
    drawWeather(weather);
  }, [timeClock])

  return (
    <div className="drawer" onClick={(e) => {drawEvent(e);}} ref={backRef}>
    <canvas key="home-drawer" height="400" width={`${individualWidth * ratio}`} ref={canvasRef}>
        Drawer Drawer
    </canvas>
    <canvas key="weather-drawer" height="400" width={`${individualWidth * ratio}`} ref={weatherRef}>
      Weather Drawer
    </canvas>
    </div>
  );
}

export function MainBoard () {
  return (
    <div className="main-board" key="main-board" >
        <PunkxielDrawer></PunkxielDrawer>
    </div>
  );
}
