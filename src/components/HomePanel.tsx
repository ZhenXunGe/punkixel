import React, { useState, useRef, useEffect } from 'react';
import { useAppSelector, useAppDispatch } from '../app/hooks';
import 'bootstrap/dist/css/bootstrap.min.css';
import {
    individualWidth,
    individualHeight,
    getCorIndex,
    DrawerBoardProp,
    buildPainter,
} from "../data/draw"

import {
    selectDye,
    selectHomeIndex,
    updatePPH,
} from '../data/statusSlice';

import {
  addEvent,
  selectSketchSignal,
  selectTimeClock,
  signalSketch,
  selectReaction,
  setReaction,
} from '../dynamic/dynamicSlice';
import getWorld, { getBackground } from '../data/world';
import { drawWeather, drawMesh, drawReaction } from '../data/weather';
import { AdviceEvent } from '../dynamic/event';
import { HandlerProxy } from '../layout/handlerProxy';



interface HomePanelProp {
  handlerProxy: HandlerProxy;
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


  const reaction = useAppSelector(selectReaction);
  useEffect(() => {
    let drawer = getWorld().getInstance(homeIndex*individualWidth).drawer;
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');
    const image = context.getImageData(0, 0, individualWidth*restrictRatio, individualHeight*restrictRatio);

    let painter = buildPainter(image, props, timeClock);
    drawer.draw(painter,homeIndex*individualWidth);
    context.putImageData(image,0,0);
    const instance = getWorld().getInstance(homeIndex);
    const backref = backRef.current!;
    backref.style.backgroundImage = `url(${getBackground(instance.info.background)})`;
  }, [sketchSignal, timeClock])

  useEffect(() => {
    const weather = weatherRef.current!;
    drawWeather(weather);
    if (props.ratio > 4) {
      drawMesh(weather, props.ratio);
    }
    if (reaction) {
      drawReaction(weather, reaction);
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

  const [action, setAction] = useState("paint");

  const safeSetOffsetX = (x:number) => {
    let xx = x + Math.floor(1000/ratio);
    if (xx <= 250 && x>=0) {
      setOffsetX(x);
    }
  }

  const safeSetOffsetY = (y:number) => {
    let yy = y + Math.floor(400/ratio);
    if (yy <= 100 && y>=0) {
      setOffsetY(y);
    }
  }


  const getRatio = () => {return ratio;};
  function handlePaint(left:number, top:number) {
    if (action === "paint") {
      var x = Math.floor(left/ratio) + offsetX;
      var y = Math.floor((400 - top)/ratio) + offsetY;
      console.log(left, top, x, y, offsetX, offsetY);
      let drawer = getWorld().getInstance(homeIndex*individualWidth).drawer;
      let [delta, cost] = drawer.pushPixelDelta(getCorIndex(x,y), pickedDye);
      dispatch(signalSketch());
      dispatch(setReaction({offsetLeft:left, offsetTop:top, duration:5, current:0, clip:"paint"}));
      dispatch(updatePPH({delta:delta, cost:cost}));
    } else if (action === "left") {
      safeSetOffsetX(offsetX-1);
    } else if (action === "right") {
      safeSetOffsetX(offsetX+1);
    } else if (action === "top") {
      safeSetOffsetY(offsetY-1);
    } else if (action === "bottom") {
      safeSetOffsetY(offsetY+1);
    }
  }

  function scrollEvent(shrink: boolean) {
    let ratio = getRatio();
    let yy = offsetY + Math.floor((400 - mouseTop)/ratio);
    let xx = offsetX + Math.floor(mouseLeft/ratio);
    if (shrink) {
      if (ratio > 4) {
        setRatio(ratio-1);
        let newOffsetX = xx-Math.floor(mouseLeft/(ratio-1));
        let newOffsetY = yy+Math.floor(mouseTop/(ratio-1)) - Math.floor(400/(ratio-1));
        setOffsetX(newOffsetX<0? 0: newOffsetX);
        setOffsetY(newOffsetY<0? 0: newOffsetY);

      }
    } else {
      if (ratio < 24) {
        setRatio(ratio+1);
        let newOffsetX = xx-Math.floor(mouseLeft/(ratio+1));
        let newOffsetY = yy+Math.floor(mouseTop/(ratio+1)) - Math.floor(400/(ratio+1));
        setOffsetX(newOffsetX<0? 0: newOffsetX);
        setOffsetY(newOffsetY<0? 0: newOffsetY);
      }
    }
    console.log("ratio is:", ratio);
  }

  function moveEvent(left: number, top:number) {
    setMouseLeft(left);
    setMouseTop(top);
    let yy = offsetY + Math.floor(400/ratio);
    let xx = offsetX + Math.floor(1000/ratio);
    console.log(offsetX, offsetY, xx, yy);
    if (left < 50 && offsetX > 0) {
      setAction("left");
    } else if (left > 950 && xx < 250) {
      setAction("right");
    } else if (top<50 && yy < 100) {
      setAction("top");
    } else if (top>350 && offsetY > 0) {
      setAction("bottom");
    } else {
      setAction("paint");
    }
  }
  const boardRef = React.createRef<HTMLDivElement>();
  React.useEffect(()=>{
    console.log("boardRef changed");
    if (boardRef.current) {
      props.handlerProxy.registerClick("frame", boardRef.current!, (left, top)=>{handlePaint(left, top);});
      props.handlerProxy.registerHover("frame", boardRef.current!, (left, top)=>{moveEvent(left, top)}, `cursor-${action}`);
      props.handlerProxy.registerScroll("frame", boardRef.current!, (direction)=>{scrollEvent(direction);});
    }
  },[boardRef.current, ratio, pickedDye, action, offsetX, offsetY]);
  React.useEffect(()=>{
    console.log("ratio changed", ratio);
    return ()=>{
      console.log("ratio end1", ratio);
      }
  },[ratio]);
  React.useEffect(()=>{
    return ()=>{
    console.log("ratio end", ratio);
    }
  },[]);
  return (
    <div className="main-board" key="main-board" ref={boardRef} >
        <DrawerBoard ratio={ratio}
            offsetX={offsetX} offsetY={offsetY}
            canvasHeight={400} canvasWidth={1000}
        ></DrawerBoard>
    </div>
  )
}
