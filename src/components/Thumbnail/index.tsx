import React, { useRef, useEffect } from 'react';
import { useAppSelector, useAppDispatch } from '../../app/hooks';
import {
  individualWidth,
  buildPainter,
} from "../../data/draw"
import { selectAlien, selectSketchSignal, selectTimeClock, selectViewIndex } from '../../dynamic/dynamicSlice';
import { getWorld } from '../../data/world';
import FRAME from '../../images/layout/frame.png';
import './style.scss';
import { selectPanel } from '../../layout/layoutSlice';
import {
  selectPlayer,
} from '../../data/statusSlice';

function ThumbnailInternal() {

  const canvasRef = useRef<any>();
  const sketchSignal = useAppSelector(selectSketchSignal);
  const player = useAppSelector(selectPlayer);
  const viewIndex = useAppSelector(selectViewIndex);
  const alien = useAppSelector(selectAlien);
  const timeClock = useAppSelector(selectTimeClock);
  const panel = useAppSelector(selectPanel);

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
    if (panel === "world") {
      let start = Math.floor(alien.pos/individualWidth) - 2
      let end = start + 3;
      getWorld().rend(painter, start, end, alien.pos-individualWidth*2);
    } else if(panel === "home") {
      let start = player?.homeIndex!-2;
      let end = start + 3;
      getWorld().rend(painter, start, end, player?.homeIndex!*individualWidth - 335);
    }
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
  } else if (panel === "market") {
    return (<></>);
  } else {
    return (<></>);
  }
}

export function SingleThumbnail() {
  const canvasRef = useRef<any>();
  const timeClock = useAppSelector(selectTimeClock);
  const player = useAppSelector(selectPlayer)!;
  const homeIndex = player.homeIndex;

  useEffect(() => {
    const canvas = canvasRef.current
    const context = canvas.getContext('2d')
    const image = context.getImageData(0, 0, canvas.width, canvas.height)
    let painter = buildPainter(image, {
            ratio:1,
            offsetX:0,
            offsetY:0,
            canvasHeight:100,
            canvasWidth:250,
    }, timeClock);
    let drawer = getWorld().getInstanceByIndex(homeIndex).drawer;
    drawer.draw(painter,homeIndex*individualWidth);
    context.putImageData(image,0,0);
  })

  return (
    <div className="thumbnail-single">
      <canvas height="100" width="250" ref={canvasRef} key="thumbnail-single-canvas">
      Drawer Drawer
      </canvas>
    </div>
  );

}
