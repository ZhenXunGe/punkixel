import React, { useState, useRef, useEffect } from 'react';
import { useAppSelector, useAppDispatch } from '../app/hooks';
import { Button, DropdownButton, Dropdown } from 'react-bootstrap';
import { Dye, ofDyeIndex, IsNillDye, toDyeColor } from "../data/palette";
import 'bootstrap/dist/css/bootstrap.min.css';
import {
    Drawer,
    EmptyInstance,
    World,
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
    selectPaletteFocus,
    selectDye,
    paintColor,
    selectHomeIndex,
    selectTimeClock,
    selectWorld,
    selectSketchSignal,
    signalSketch,
} from '../data/statusSlice';

interface IProps {
}

export function PunkxielDrawer(props: IProps) {

  let ratio = 4;

  const dispatch = useAppDispatch();
  const canvasRef = useRef<any>();
  const palettes = useAppSelector(selectPalettes);
  const pickedPalette = useAppSelector(selectPaletteFocus);
  const pickedDye = useAppSelector(selectDye);
  const world = useAppSelector(selectWorld);
  const homeIndex = useAppSelector(selectHomeIndex);
  const timeClock = useAppSelector(selectTimeClock);
  const sketchSignal = useAppSelector(selectSketchSignal);

  function drawEvent(e:any) {
    var x = Math.floor(e.nativeEvent.offsetX/4);
    var y = Math.floor(e.nativeEvent.offsetY/4);
    var dyeIndex = toDyeIndex(palettes[pickedPalette].idx, pickedDye);
    let drawer = world.getInstance(homeIndex*individualWidth).drawer;
    drawer.pushPixelDelta(getCorIndex(x,100-y), dyeIndex);
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
    let drawer = world.getInstance(homeIndex*individualWidth).drawer;
    drawer.draw(painter, homeIndex*individualWidth);
    context.putImageData(image,0,0);
  }, [])

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
    let drawer = world.getInstance(homeIndex*individualWidth).drawer;
    drawer.draw(painter, homeIndex*individualWidth);
    context.putImageData(image,0,0);
  }, [sketchSignal, timeClock])

  return (
    <div className="drawer" onClick={(e) => {drawEvent(e);}}>
    <canvas height="400" width="900" ref={canvasRef}>
        Drawer Drawer
    </canvas>
    </div>
  );
}

