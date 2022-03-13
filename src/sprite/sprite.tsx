import { MutableRefObject, useEffect } from "react";
import { useAppDispatch } from "../app/hooks";
import { installSprite, loadSpriteFrame } from "./spriteSlice";

export type Painter = (sheet: ImageData, left:number, top:number, width:number, height:number) => void

interface Clips {
  [name:string]: Array<HTMLImageElement>;
}

export class Sprite {
    sheet: Clips;
    currentClip: string;
    currentTrigger: number;
    frequency: number;
    frameWidth: number;
    frameHeight: number;
    x: number;
    y: number;
    constructor(
      frequency: number,
      framewidth: number,
      frameheight: number,
      totalframes: number,
      x: number,
      y: number,
      current: string,
    ) {
      this.sheet = {};
      this.currentTrigger = 0;
      this.currentClip = current;
      this.frequency = frequency;
      this.frameWidth = framewidth;
      this.frameHeight = frameheight;
      this.x = x;
      this.y = y;
    }
    getClip(name:string) {
      return this.sheet[name];
    }
    setFrame(
      img: HTMLImageElement,
      name: string,
      index: number,
      of: number,
    ) {
      if(this.sheet[name]) {
        this.sheet[name][index]  = img;
      } else {
        this.sheet[name] = new Array(of);
        this.sheet[name][index]  = img;
      }
    }
    getFrame(
      name:string,
      idx: number,
    ) {
      return this.sheet[name][idx];
    }
    setState(state:string) {
      this.currentClip = state;
    }
    paint(canvas:HTMLCanvasElement, x:number, y:number, timeClock:number) {
      let past = timeClock - this.currentTrigger;
      if (this.sheet[this.currentClip]) {
        let frameCount = past % this.sheet[this.currentClip].length;
        let frame = this.sheet[this.currentClip][frameCount];
        if (frame) {
        //console.log("frame is: ", frame);
        let ctx = canvas.getContext("2d");
        ctx?.drawImage(frame, x, y, this.frameWidth, this.frameHeight);
        }
      }
      else {
        console.log("clip", this.currentClip);
      }
    }
    paintAt(canvas:HTMLCanvasElement, x:number, y:number, f:number) {
      if (this.sheet[this.currentClip]) {
        let frame = this.sheet[this.currentClip][f];
        if (frame) {
        //console.log("frame is: ", frame);
        let ctx = canvas.getContext("2d");
        ctx?.drawImage(frame, x, y, this.frameWidth, this.frameHeight);
        }
      }
      else {
        console.log("clip", this.currentClip);
      }
    }
    switchClip(clip: string) {
      this.currentClip = clip;
    }
}

export interface ClipInfo {
  name:string;
  src: Array<string>;
}

export interface LoadingIProps {
  sprite: Sprite;
  width: number;
  height: number;
  clips: Array<ClipInfo>;
  name: string;
}

export function LoadSprite(props:LoadingIProps) {
  const dispatch = useAppDispatch();
  var sum = 0;
  for (var clip of props.clips) {
    sum += clip.src.length;
  }
  console.log(`install sprite ${props.name} ${sum}`);
  useEffect(()=>{
    dispatch(installSprite({
    name:props.name,
    resource:sum,
    sprite:props.sprite,
    }))
  },[]);

  return (
  <div className="hide">
  {
    props.clips.map((clip, k) => {
      {
      return clip.src.map((c,i)=> (
      <img style={{height:props.height, width:props.width}} key={`sprite-alien-${i}`} src={c} ref={(e)=>
        {
          // onLoad replacement for SSR
          console.log(`Loading Resource of Sprites ${props.name} ${k} ${i}`);
          if (!e) { return; }
          const img = e;
          const updateFunc = () => {
            props.sprite.setFrame(img, clip.name, i, clip.src.length);
            dispatch(loadSpriteFrame());
          };
          if (img.complete) {
            updateFunc();
          } else {
            img.onload = updateFunc;
          }
        }
      }></img>
      ))
      }
    })
  }
  </div>
  );
}