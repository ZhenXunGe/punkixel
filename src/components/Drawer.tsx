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
  const dispatch = useAppDispatch();
  const canvasRef = useRef<any>();
  const palettes = useAppSelector(selectPalettes);
  const pickedPalette = useAppSelector(selectPaletteFocus);
  const pickedDye = useAppSelector(selectDye);
  const [drawer, setDrawer] = React.useState<Drawer>();
  const world = useAppSelector(selectWorld);
  const homeIndex = useAppSelector(selectHomeIndex);
  const timeClock = useAppSelector(selectTimeClock);
  const sketchSignal = useAppSelector(selectSketchSignal);

  function drawEvent(e:any) {
    var x = Math.floor(e.nativeEvent.offsetX/4);
    var y = Math.floor(e.nativeEvent.offsetY/4);
    var dyeIndex = toDyeIndex(palettes[pickedPalette].idx, pickedDye);
    drawer?.pushPixelDelta(getCorIndex(x,100-y), dyeIndex);
    dispatch(signalSketch());
  }

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');
    let painter = (x:number, y:number, c:number) => {
      context.fillStyle = toDyeColor(c, timeClock);
      context.fillRect(x*4, (100-y)*4, 4, 4);
    };
    //Our first draw
    for (var i=0; i<900; i=i+4) {
        for (var j=0; j<400; j=j+4) {
            if ((i + j)%8 == 0) {
                context.fillStyle = '#eee';
            } else {
                context.fillStyle = '#ffffff';
            }
            context.fillRect(i, j, 4, 4);
        }
    }
    let d = world.getInstance(homeIndex*individualWidth).drawer;
    setDrawer(d);
    d.draw(painter, homeIndex*individualWidth);
  }, [])

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');
    let painter = (x:number, y:number, c:number) => {
      context.fillStyle = toDyeColor(c, timeClock);
      context.fillRect(x*4, (100-y)*4, 4, 4);
    };

    drawer?.draw(painter, homeIndex*individualWidth);
  }, [sketchSignal, timeClock])

  return (
    <div className="drawer" onClick={(e) => {drawEvent(e);}}>
    <canvas height="400" width="900" ref={canvasRef}>
        Drawer Drawer
    </canvas>
    </div>
  );
}

