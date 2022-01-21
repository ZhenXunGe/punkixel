import React, { useState, useRef, useEffect } from 'react';
import { useAppSelector, useAppDispatch } from '../app/hooks';
import { Button, DropdownButton, Dropdown } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Drawer, EmptyInstance, World, individualWidth } from "../data/draw"

import {
    action,
    selectPalettes,
    selectPaletteFocus,
    selectDye,
    paintColor,
    selectHomeIndex,
    selectWorld,
    selectSketchSignal,
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
  const sketchSignal = useAppSelector(selectSketchSignal);

  function drawEvent(e:any) {
    const canvas = canvasRef.current;
    const context = canvas?.getContext('2d');
    context.fillStyle = palettes[pickedPalette].dye[pickedDye].color;
    console.log(e.nativeEvent.offsetX/4, e.nativeEvent.offsetY/4);
    var x = Math.floor(e.nativeEvent.offsetX/4);
    var y = Math.floor(e.nativeEvent.offsetY/4);
    context.fillRect(x * 4, y * 4, 4, 4);
    dispatch(paintColor(pickedDye));
  }

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');
    let painter = (x:number, y:number, c:string) => {
      context.fillStyle = c;
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
    let painter = (x:number, y:number, c:string) => {
      context.fillStyle = c;
      context.fillRect(x*4, (100-y)*4, 4, 4);
    };

    drawer?.resetSketch();
    drawer?.draw(painter, homeIndex*individualWidth);
  }, [sketchSignal])

  return (
    <div className="drawer" onClick={(e) => {drawEvent(e);}}>
    <canvas height="400" width="900" ref={canvasRef}>
        Drawer Drawer
    </canvas>
    </div>
  );
}

