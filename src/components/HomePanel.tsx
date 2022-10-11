import React, { useState, useRef, useEffect } from 'react';
import { useAppSelector, useAppDispatch } from '../app/hooks';
import 'bootstrap/dist/css/bootstrap.min.css';
import {
    individualWidth,
    individualHeight,
    getCorIndex,
    DrawerBoardProp,
    buildPainter,
    ofCorIndex,
} from "../data/draw"

import {
    selectDye,
    selectPlayer,
    selectMode,
    updatePPH,
} from '../data/statusSlice';

import {
  selectSketchSignal,
  selectTimeClock,
  signalSketch,
  selectReaction,
  setReaction,
} from '../dynamic/dynamicSlice';
import { getWorld, getBackground } from '../data/world';
import { drawWeather, drawMesh, drawReaction } from '../data/weather';
import { AdviceEventRender } from '../dynamic/event';
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
  const player = useAppSelector(selectPlayer)!;
  const homeIndex = player.homeIndex;
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
  const player = useAppSelector(selectPlayer)!;
  const homeIndex = player.homeIndex;
  const pickedDye = useAppSelector(selectDye);
  const mode = useAppSelector(selectMode);

  const [ratio,setRatio]  = useState(4);
  const [offsetX, setOffsetX] = useState(0);
  const [offsetY, setOffsetY] = useState(0);

  const [startX, setStartX] = useState(0);
  const [startY, setStartY] = useState(0);

  const [mouseLeft, setMouseLeft] = useState(0);
  const [mouseTop, setMouseTop] = useState(0);

  const [action, setAction] = useState("paint");

  const [subMode, setSubMode] = useState("none");

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

  function handleClick(left:number, top:number) {
    if (action === "paint") {
      if (mode === "point") {
        handlePoint(left, top);
      } else if (mode === "fill") {
        handleFill(left, top);
      }
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

  function handlePoint(left:number, top:number) {
    var x = Math.floor(left/ratio) + offsetX;
    var y = Math.floor((400 - top)/ratio) + offsetY;
    //console.log(left, top, x, y, offsetX, offsetY);
    let drawer = getWorld().getInstance(homeIndex*individualWidth).drawer;
    let [delta, cost] = drawer.pushPixelDelta(getCorIndex(x,y), pickedDye);
    dispatch(signalSketch());
    dispatch(updatePPH({delta:delta, cost:cost}));
  }

  function getFillPoints(x:number, y:number, dyeindex:number) {
    let index = getCorIndex(x,y);
    let drawer = getWorld().getInstance(homeIndex*individualWidth).drawer;
    let collected: Array<number> = [index];
    let extended:Array<number> = [];
    let scaned:Array<number> = [];
    let push_collected = (idx: number) => {
      if (scaned.indexOf(idx) === -1
              && extended.indexOf(idx) === -1
              && collected.indexOf(idx) === -1) {
        collected.push(idx);
      }
    }
    while (collected.length > 0) {
      let idx = collected.pop()!;
      let d = drawer.getStackedPixel(idx);
      scaned.push(idx);
      if (d !== dyeindex) {
        continue;
      }
      extended.push(idx);
      let [x,y] = ofCorIndex(idx);
      if (x>0) {
          push_collected(getCorIndex(x-1, y));
      }
      if (y>0) {
          push_collected(getCorIndex(x, y-1));
      }
      if (x<individualWidth-1) {
          push_collected(getCorIndex(x+1, y));
      }
      if (y<individualHeight-1) {
          push_collected(getCorIndex(x, y+1));
      }
    }
    return extended;
  }

  function handleFill(left: number, top: number) {
    var x = Math.floor(left/ratio) + offsetX;
    var y = Math.floor((400 - top)/ratio) + offsetY;

    let index = getCorIndex(x,y);
    let drawer = getWorld().getInstance(homeIndex*individualWidth).drawer;
    let d = drawer.getStackedPixel(index);
    let cost = 0;
    let delta = 0;
    if (mode === "fill") {
      let points:Array<number> = getFillPoints(x, y, d);
      for (var point of points) {
        let [d, c] = drawer.pushPixelDelta(point, pickedDye);
        delta += d;
        cost += c;
      }
      dispatch(signalSketch());
      dispatch(updatePPH({delta:delta, cost:cost}));
      console.log("fill");
    }
  }

  function handleMouseDown(left: number, top:number) {
    console.log("mouse down", left, top);
    var x = Math.floor(left/ratio) + offsetX;
    var y = Math.floor((400 - top)/ratio) + offsetY;
    setStartX(x);
    setStartY(y);
    setSubMode("progress");
    console.log("mouse down", x, y);
  }

  function getPassPoints(startX:number, startY:number, endX:number, endY:number) {
    let deltaX = Math.abs(startX - endX);
    let deltaY = Math.abs(startY - endY);
    let points:Array<Array<number>> = [];
    if (deltaX > deltaY) {
      for (var i=0; i< deltaX; i++) {
         let x = startX + i * Math.sign(endX- startX);
         let y = startY + Math.floor(i * deltaY/deltaX) * Math.sign(endY - startY);
         points.push([x,y]);
      }
    } else {
      for (var i=0; i< deltaY; i++) {
         let x = startX + Math.floor(i * deltaX/deltaY) * Math.sign(endX - startX);
         let y = startY + i * Math.sign(endY - startY);
         points.push([x,y]);
      }
    }
    console.log("deltaX", deltaX, "deltaY", deltaY);
    return points;
  }

  function handleMouseUp(left: number, top:number) {
    console.log("mouse up", startX, startY);
    if (mode === "line") {
      var endX = Math.floor(left/ratio) + offsetX;
      var endY = Math.floor((400 - top)/ratio) + offsetY;
      let points = getPassPoints(startX, startY, endX, endY);
      let delta = 0;
      let cost = 0;
      let drawer = getWorld().getInstance(homeIndex*individualWidth).drawer;
      for (var point of points) {
        let [d, c] = drawer.pushPixelDelta(getCorIndex(point[0],point[1]), pickedDye);
        delta += d;
        cost += c;
      }
      dispatch(signalSketch());
      dispatch(updatePPH({delta:delta, cost:cost}));
    }
    dispatch(setReaction({offsetLeft:left, offsetTop:top, duration:5, current:0, clip:"paint"}));
    setSubMode("none");
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

  function continuePaint(left:number, top:number) {
    if (mode === "pen" && subMode === "progress") {
      handlePoint(left, top);
    }
  }

  function handleMouseMove(left: number, top:number) {
    // set position for scroll
    setMouseLeft(left);
    setMouseTop(top);

    let yy = offsetY + Math.floor(400/ratio);
    let xx = offsetX + Math.floor(1000/ratio);
    //console.log(offsetX, offsetY, xx, yy);

    if (action === "paint" && mode == "pen" && subMode !== "none") {
      continuePaint(left, top)
      //Some painting action has not be finished
    } else {
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
  }


  const boardRef = React.createRef<HTMLDivElement>();
  React.useEffect(()=>{
    if (boardRef.current) {
      props.handlerProxy.registerClick("frame", boardRef.current!, (left, top)=>{handleClick(left, top);});
      props.handlerProxy.registerHover("frame", boardRef.current!, (left, top)=>{handleMouseMove(left, top)}, `cursor-${action}`);
      props.handlerProxy.registerMouseDown("frame", boardRef.current!, (left, top)=>{handleMouseDown(left, top)});
      props.handlerProxy.registerMouseUp("frame", boardRef.current!, (left, top)=>{handleMouseUp(left, top)});
      props.handlerProxy.registerScroll("frame", boardRef.current!, (direction)=>{scrollEvent(direction);});
    }
  },[boardRef.current, ratio, pickedDye, action, offsetX, offsetY, startX, startY, mode, subMode]);
  React.useEffect(()=>{
    return ()=>{
      //console.log("ratio end1", ratio);
    }
  },[ratio]);
  React.useEffect(()=>{
    return ()=>{
      //console.log("ratio end", ratio);
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
