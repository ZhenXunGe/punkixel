import React, { useState, useRef, useEffect } from 'react';
import { useAppSelector, useAppDispatch } from '../app/hooks';
import 'bootstrap/dist/css/bootstrap.min.css';
import './Component.scss';

import {
    individualWidth,
    individualHeight,
} from "../data/draw"
import { toDyeColor } from "../data/palette"

import {
  selectAlien,
  selectTimeClock,
  selectViewIndex,
  getDynamicInfo,
} from '../dynamic/dynamicSlice';
import getWorld, { getBackground } from '../data/world';
import { Minion } from "../data/minion";


import { getSprite } from '../sprite/spriteSlice';
import Frame from '../sprite/Frame';
import { drawWeather } from '../data/weather';
import { HandlerProxy } from '../layout/handlerProxy';
import { MinionInfoBox } from '../modals/unlock';

interface IProps {
}

function WorldBoard (props: IProps) {

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
    drawer.draw({paint: painter, delta: painter}, viewIndex*individualWidth);
    context.putImageData(image,0,0);
    const instance = getWorld().getInstance(viewIndex);
    backref.style.backgroundImage = `url(${getBackground(instance.info.background)})`;
  }, [viewIndex, timeClock])

  useEffect(() => {
    const weather = weatherRef.current!;
    drawWeather(weather);
  }, [timeClock])




  return (
    <div className="drawer" onClick={(e) => {clickEvent(e);}} ref={backRef}>
    <canvas key="drawer-world-board" height="400" width={`${individualWidth*ratio}`} ref={canvasRef}>
        Drawer Drawer
    </canvas>
    <canvas key="weather-drawer" height="400" width={`${individualWidth * ratio}`} ref={weatherRef}>
      Weather Drawer
    </canvas>
    </div>
  );
}

export function AlienAnimation() {
  const dispatch = useAppDispatch();
  const canvasRef = useRef<HTMLCanvasElement>();

  const spriteUFO = getSprite("ufo");
  return (
  <>
    <Frame minion={spriteUFO} canvasRef={canvasRef}></Frame>
    <div className="animation" >
        <div className="body">
        <canvas height="400" width="1000" ref={e => {
          console.log("canvanref");
          canvasRef.current = e!
          }}>
            Drawer Drawer
        </canvas>
        </div>
    </div>
  </>
  );
}

interface WorldPanelProp {
  handlerProxy: HandlerProxy;
}

export function WorldPanel(props: WorldPanelProp) {

  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const [pickFrameX, setPickFrameX] = useState(-100000);
  const [pickFrameY, setPickFrameY] = useState(-100000);

  const [minion, setMinion] = useState<Minion|null>(null);
  function pickEvent(offsetX:number, offsetY:number) {
    let dynamic = getDynamicInfo();
    let m = dynamic.getFocus(offsetX, offsetY);
    if (m) {
       setMinion(m.minion);
       setShow(true);
       console.log("minion picked", m.minion.id);
    }
  }
  function hoverEvent(offsetX:number, offsetY:number) {
    let dynamic = getDynamicInfo();
    let m = dynamic.getFocus(offsetX, offsetY);
    if (m) {
       setPickFrameX(m.offsetX + m.minion.x);
       setPickFrameY(m.offsetY + m.minion.y);
       console.log("minion hover", m.minion.id);
    } else {
       setPickFrameX(-10000);
       setPickFrameY(-10000);
    }
  }

  const boardRef = React.createRef<HTMLDivElement>();
  React.useEffect(()=>{
    if (boardRef.current) {
      props.handlerProxy.registerClick("frame", boardRef.current!, (left, top)=>{pickEvent(left, top);});
      props.handlerProxy.registerHover("frame", boardRef.current!, (left, top)=>{hoverEvent(left, top);});
    }
  },[boardRef])

  return (
    <>
    <div className="main-board" key="main-board" ref={boardRef} >
      <WorldBoard></WorldBoard>
    </div>
    <AlienAnimation key="alien"></AlienAnimation>
    <div className="pick-frame" >
      <div style={{left:pickFrameX, top:pickFrameY}}></div>
    </div>
      <MinionInfoBox show={show} handleClose={handleClose}
            handleConfirm={handleClose} position={0}
              minion={minion} topic={`Owned by: ${minion?.owner} [contribution: ${minion?.contribution}]`}></MinionInfoBox>
    </>
  );
}
