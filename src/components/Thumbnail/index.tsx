import React, { useState, useRef, useEffect } from 'react';
import { useAppSelector, useAppDispatch } from '../../app/hooks';
import { toDyeColor } from '../../data/palette';
import {
  individualWidth,
  buildPainter,
} from "../../data/draw"
import { selectAlien, selectSketchSignal, selectTimeClock, selectViewIndex } from '../../dynamic/dynamicSlice';
import { getWorld } from '../../data/world';
import FRAME from '../../images/layout/frame.png';
import './style.scss';
import { selectPanel } from '../../layout/layoutSlice';
function ThumbnailInternal() {

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
    let painter = buildPainter(image, {
            ratio:1,
            offsetX:0,
            offsetY:0,
            canvasHeight:100,
            canvasWidth:1000,
    }, timeClock);
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

export function Thumbnail() {
  const panel = useAppSelector(selectPanel);
  if (panel === "world" ||  panel === "home") {
    return (<ThumbnailInternal></ThumbnailInternal>);
  } else {
    return (<></>);
  }
}
