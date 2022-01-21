import React, { useState, useRef, useEffect } from 'react';
import { useAppSelector, useAppDispatch } from '../app/hooks';
import { Button, DropdownButton, Dropdown } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Drawer, EmptyInstance, World, individualWidth } from "../data/draw"

import {
    action,
    selectDye,
    paintColor,
    selectHomeIndex,
    selectWorld,
    selectViewIndex,
} from '../data/statusSlice';

interface IProps {
}

export function WorldBoard (props: IProps) {
  const dispatch = useAppDispatch();
  const canvasRef = useRef<any>();
  const pickedDye = useAppSelector(selectDye);
  const [drawer, setDrawer] = React.useState<Drawer>();
  const world = useAppSelector(selectWorld);
  const homeIndex = useAppSelector(selectHomeIndex);
  const viewIndex = useAppSelector(selectViewIndex);

  function clickEvent(e:any) {
    console.log(e.nativeEvent.offsetX/4, e.nativeEvent.offsetY/4);
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
    let d = world.getInstance(viewIndex*individualWidth).drawer;
    setDrawer(d);
    d.draw(painter, viewIndex*individualWidth);
  }, [viewIndex])

  return (
    <div className="main-board">
    <div className="drawer" onClick={(e) => {clickEvent(e);}}>
    <canvas height="400" width="900" ref={canvasRef}>
        Drawer Drawer
    </canvas>
    </div>
    </div>
  );
}
