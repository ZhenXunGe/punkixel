import React, { useState, useRef, useEffect } from 'react';
import { useAppSelector, useAppDispatch } from '../app/hooks';
import { Button, DropdownButton, Dropdown } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Drawer, EmptyInstance, World, individualWidth } from "../data/draw"
import { toDyeColor } from "../data/palette"

import {
    action,
    selectDye,
    paintColor,
    selectHomeIndex,
    selectWorld,
    selectTimeClock,
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
  const timeClock = useAppSelector(selectTimeClock);
  const homeIndex = useAppSelector(selectHomeIndex);
  const viewIndex = useAppSelector(selectViewIndex);

  function clickEvent(e:any) {
    console.log(e.nativeEvent.offsetX/4, e.nativeEvent.offsetY/4);
  }

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');
    let painter = (x:number, y:number, c:number) => {
      context.fillStyle = toDyeColor(c, timeClock);
      context.fillRect(x*4, (100-y)*4, 4, 4);
    };
    let d = world.getInstance(viewIndex*individualWidth).drawer;
    setDrawer(d);
    d.draw(painter, viewIndex*individualWidth);
  }, [viewIndex, timeClock])

  return (
    <div className="main-board">
    <div className="drawer" onClick={(e) => {clickEvent(e);}}>
    <canvas key="drawer-world-board" height="400" width="900" ref={canvasRef}>
        Drawer Drawer
    </canvas>
    </div>
    </div>
  );
}
