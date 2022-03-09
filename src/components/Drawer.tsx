import React, { useState, useRef, useEffect } from 'react';
import { useAppSelector, useAppDispatch } from '../app/hooks';
import { Button, DropdownButton, Dropdown } from 'react-bootstrap';
import { Dye, ofDyeIndex, IsNillDye, toDyeColor } from "../data/palette";
import 'bootstrap/dist/css/bootstrap.min.css';
import {
    individualWidth,
    individualHeight,
    getCorIndex, ofCorIndex,
} from "../data/draw"

import {
  toDyeIndex,
} from "../data/palette"



import {
    action,
    selectPalettes,
    selectDye,
    paintColor,
    selectHomeIndex,
} from '../data/statusSlice';

import {
  selectSketchSignal,
  selectTimeClock, signalSketch,
} from '../dynamic/dynamicSlice';
import getWorld from '../data/world';

interface IProps {
}

export function PunkxielDrawer(props: IProps) {

  let ratio = 4;

  const dispatch = useAppDispatch();
  const canvasRef = useRef<any>();
  const pickedDye = useAppSelector(selectDye);
  const homeIndex = useAppSelector(selectHomeIndex);
  const timeClock = useAppSelector(selectTimeClock);
  const sketchSignal = useAppSelector(selectSketchSignal);

  function drawEvent(e:any) {
    var x = Math.floor(e.nativeEvent.offsetX/4);
    var y = Math.floor(e.nativeEvent.offsetY/4);
    let drawer = getWorld().getInstance(homeIndex*individualWidth).drawer;
    drawer.pushPixelDelta(getCorIndex(x,100-y), pickedDye);
    dispatch(signalSketch());
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
    let drawer = getWorld().getInstance(homeIndex*individualWidth).drawer;
    drawer.draw(painter, homeIndex*individualWidth);
    context.putImageData(image,0,0);
  }, [sketchSignal, timeClock])

  return (
    <div className="drawer" onClick={(e) => {drawEvent(e);}}>
    <canvas key="home-drawer" height="400" width={`${individualWidth * ratio}`} ref={canvasRef}>
        Drawer Drawer
    </canvas>
    </div>
  );
}

