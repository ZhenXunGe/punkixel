import React, { useState, useRef, useEffect } from 'react';
import { useAppDispatch } from './app/hooks';
import { clips as MonsterClips} from "./sprite/monster/sprite";
import { clips as UFOClips} from "./sprite/ufo/sprite";
import { clips as SketchClips} from "./sketch/sketch";
import { clips as SplashClips} from "./sprite/splash/sprite";
import { LoadSprite, Sprite } from './sprite/sprite';
import { Main } from './layout/Main';

import './App.css';


function App() {
  const spriteMonster = new Sprite(2, 120, 120, 13, 0, 0, "run");
  const spriteUFO = new Sprite(2, 50, 50, 1, 0, 0, "default");
  const spriteSketch = new Sprite(2, 50, 100, 1, 0, 0, "default");
  const spriteSplash = new Sprite(2, 30, 30, 1, 0, 0, "default");
  return (
    <div className="screen">
      <Main totalSprites={4}></Main>
      <LoadSprite sprite={spriteMonster} name="monster" height={120} width={120} clips={MonsterClips}></LoadSprite>
      <LoadSprite sprite={spriteUFO} name="ufo" height={40} width={40} clips={UFOClips}></LoadSprite>
      <LoadSprite sprite={spriteSketch} name="sketch" height={100} width={80} clips={SketchClips}></LoadSprite>
      <LoadSprite sprite={spriteSplash} name="splash" height={30} width={30} clips={SplashClips}></LoadSprite>
    </div>
  );
}

export default App;
