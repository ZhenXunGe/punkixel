import React, { useState, useRef, useEffect } from 'react';
import { useAppSelector, useAppDispatch } from '../app/hooks';
import { toDyeColor } from "../data/palette";
import 'bootstrap/dist/css/bootstrap.min.css';
import {
    individualWidth,
    individualHeight,
    getCorIndex,
} from "../data/draw"

import {
    selectDye,
    selectHomeIndex,
    updatePPH,
} from '../data/statusSlice';

import {
  addEvent,
  selectSketchSignal,
  selectTimeClock, signalSketch,
} from '../dynamic/dynamicSlice';
import getWorld, { getBackground } from '../data/world';
import { drawWeather, drawMesh } from '../data/weather';
import { AdviceEvent } from '../dynamic/event';
import { HandlerProxy } from '../layout/handlerProxy';



interface HomePanelProp {
  handlerProxy: HandlerProxy;
}

interface DrawerBoardProp {
  ratio: number;
  offsetX: number;
  offsetY: number;
}


export function DrawerBoard(props: DrawerBoardProp) {

  const restrictRatio = 4;
  const dispatch = useAppDispatch();
  const canvasRef = useRef<any>();
  const backRef = useRef<any>();
  const weatherRef = useRef<any>();

  const homeIndex = useAppSelector(selectHomeIndex);
  const timeClock = useAppSelector(selectTimeClock);
  const sketchSignal = useAppSelector(selectSketchSignal);
  useEffect(() => {
    let drawer = getWorld().getInstance(homeIndex*individualWidth).drawer;
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');
    const image = context.getImageData(0, 0, individualWidth*restrictRatio, individualHeight*restrictRatio);

    let painter = (x:number, y:number, c:number, alpha:number) => {
      let xx = x - props.offsetX;
      let yy = y - props.offsetY;
      let sx = xx * props.ratio;
      let sy = yy * props.ratio;
      let color = toDyeColor(c, timeClock);
      for (var px=sx; px<sx+props.ratio; px++) {
        for (var py=sy; py<sy+props.ratio; py++) {
          if (py < 100*restrictRatio && px < individualWidth * restrictRatio) {
            let index = ((100 * restrictRatio - py) * individualWidth * restrictRatio + px) * 4;
              image.data[index] = color[0];
              image.data[index+1] = color[1];
              image.data[index+2] = color[2];
              image.data[index+3] = alpha;
          }
        }
      }
    };

    let delta = (x:number, y:number, c:number, alpha:number) => {
      let xx = x - props.offsetX;
      let yy = y - props.offsetY;
      let sx = xx * props.ratio;
      let sy = yy * props.ratio;
      let color = toDyeColor(c, timeClock);
      for (var px=sx; px<sx+props.ratio; px++) {
        for (var py=sy; py<sy+props.ratio; py++) {
          if (py < 100*restrictRatio && px < individualWidth * restrictRatio) {
            let index = ((100 * restrictRatio - py) * individualWidth * restrictRatio + px) * 4;
              image.data[index] += color[0] * alpha;
              image.data[index+1] += color[1] * alpha;
              image.data[index+2] += color[2] * alpha;
          }
        }
      }
    };


    drawer.draw({paint:painter, delta:delta}, homeIndex*individualWidth);
    context.putImageData(image,0,0);
    const instance = getWorld().getInstance(homeIndex);
    const backref = backRef.current!;
    backref.style.backgroundImage = `url(${getBackground(instance.info.background)})`;
  }, [sketchSignal, timeClock])

  useEffect(() => {
    const weather = weatherRef.current!;
    drawWeather(weather);
    if (props.ratio > 6) {
      drawMesh(weather, props.ratio);
    }
  }, [timeClock])

  useEffect(() => {
    let instance = getWorld().getInstance(homeIndex);
    let artistAdvice = instance.artistAdvice();
    if(artistAdvice!==null) {
      dispatch(addEvent(AdviceEvent("Artist Advise", artistAdvice!.brief, artistAdvice!.description)));
    }
    let defendingAdvice = instance.defendingAdvice();
    if(defendingAdvice!==null) {
      dispatch(addEvent(AdviceEvent("Defending Advise", defendingAdvice!.brief, defendingAdvice!.description)));
    }
  }, [])



  return (

    <div className="drawer" ref={backRef}>
    <canvas key="home-drawer" height="400" width={`${individualWidth * restrictRatio}`} ref={canvasRef}>
        Drawer Drawer
    </canvas>
    <canvas key="weather-drawer" height="400" width={`${individualWidth * restrictRatio}`} ref={weatherRef}>
      Weather Drawer
    </canvas>
    </div>

  );
}

export function HomePanel(props:HomePanelProp) {
  const dispatch = useAppDispatch();
  const homeIndex = useAppSelector(selectHomeIndex);
  const pickedDye = useAppSelector(selectDye);

  const [ratio,setRatio]  = useState(4);
  const [offsetX, setOffsetX] = useState(0);
  const [offsetY, setOffsetY] = useState(0);

  const [mouseLeft, setMouseLeft] = useState(0);
  const [mouseTop, setMouseTop] = useState(0);


  function drawEvent(left:number, top:number) {
    var x = Math.floor(left/ratio) + offsetX;
    var y = Math.floor((400 - top)/ratio) + offsetY;
    console.log(left, top, x, y, offsetX, offsetY);
    let drawer = getWorld().getInstance(homeIndex*individualWidth).drawer;
    let [delta, cost] = drawer.pushPixelDelta(getCorIndex(x,y), pickedDye);
    dispatch(signalSketch());
    dispatch(updatePPH({delta:delta, cost:cost}));
  }
  function scrollEvent(shrink: boolean) {
    let yy = offsetY + Math.floor((400 - mouseTop)/ratio);
    let xx = offsetX + Math.floor(mouseLeft/ratio);
    let ratioOld = ratio;
    if (shrink) {
      if (ratio > 4) {
        setRatio(ratio-1);
        let newOffsetX = xx-Math.floor(mouseLeft/(ratioOld-1));
        let newOffsetY = yy+Math.floor(mouseTop/(ratioOld-1)) - Math.floor(400/(ratioOld-1));
        setOffsetX(newOffsetX<0? 0: newOffsetX);
        setOffsetY(newOffsetY<0? 0: newOffsetY);

      }
    } else {
      if (ratio < 24) {
        setRatio(ratio+1);
        let newOffsetX = xx-Math.floor(mouseLeft/(ratioOld+1));
        let newOffsetY = yy+Math.floor(mouseTop/(ratioOld+1)) - Math.floor(400/(ratioOld+1));
        setOffsetX(newOffsetX<0? 0: newOffsetX);
        setOffsetY(newOffsetY<0? 0: newOffsetY);
      }
    }
  }
  const boardRef = React.createRef<HTMLDivElement>();
  React.useEffect(()=>{
    console.log("boardRef changed");
    if (boardRef.current) {
      props.handlerProxy.registerClick("frame", boardRef.current!, (left, top)=>{drawEvent(left, top);});
      props.handlerProxy.registerHover("frame", boardRef.current!, (left, top)=>{setMouseLeft(left); setMouseTop(top);});
      props.handlerProxy.registerScroll("frame", boardRef.current!, (direction)=>{scrollEvent(direction);});
    }
  },[boardRef])
  return (
    <div className="main-board" key="main-board" ref={boardRef} >
        <DrawerBoard ratio={ratio} offsetX={offsetX} offsetY={offsetY}></DrawerBoard>
    </div>
  )
}
