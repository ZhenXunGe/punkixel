import React, {useEffect, MutableRefObject, useState } from 'react';
import { useAppSelector, useAppDispatch } from '../app/hooks';
import { individualWidth } from "../data/draw";
import {
  selectTimeClock,
  resetBullets,
  addBullet,
  signalBulletsUpdate,
  signalAlien,
  switchView,
  addEvent,
  selectAlien,
  selectViewIndex,
  allBullets,
} from '../dynamic/dynamicSlice';
import { Sprite } from './sprite';
import getWorld from '../data/world';
import { AlienEvent } from '../dynamic/event';
import { Minion, spawnBullet } from '../data/minion';

interface IProps {
    monster: Sprite;
    minion: Sprite;
    canvasRef: MutableRefObject<HTMLCanvasElement | undefined>;
}

export default function Frame(prop: IProps) {
  let ratio = 4;
  const timeClock = useAppSelector(selectTimeClock);
  const dispatch = useAppDispatch();
  const alien = useAppSelector(selectAlien);
  const [minions, setMinions] = useState<Minion[]>([]);
  const viewIndex = useAppSelector(selectViewIndex);

  useEffect(() => {
      let minions = getWorld().getInstance(viewIndex*individualWidth).info.minions;
      let state = alien.status;
      prop.monster.setState(state);
      let canvas = prop.canvasRef?.current!.getContext("2d");
      let pos = (alien.pos % (individualWidth)) * ratio;
      canvas?.clearRect(0,0, 1000,400);
      prop.monster?.paint(prop.canvasRef?.current!, pos, 300, timeClock);
      dispatch(signalAlien());
      for (var b of allBullets()) {
        /*if (Math.abs(b.x-pos-43) + Math.abs(b.y - 340) <20) {
          if (canvas) {canvas!.fillStyle = "#ff0000"};
          canvas?.arc(b.x, b.y, 10,0,360, true);
        } else*/ {
          b.paint(canvas!, prop.minion);
        }
      }
      let alien_center_x = pos + 50;
      let alien_center_y = 300 + 40;
      dispatch(signalBulletsUpdate([alien_center_x, alien_center_y]));
      let idx = Math.floor(alien.pos / individualWidth);
      if (viewIndex != idx) {
        dispatch(switchView(idx));
        resetBullets();
        dispatch(addEvent(AlienEvent(alien, getWorld().getInstance(idx))));
      }
      minions.map((m,i) => {
        let minion = getWorld().getMinion(m);
        prop.minion?.paintAtClip(prop.canvasRef?.current!, minion.type, minion.x, minion.y, minion.style);
        minion.countingdown--;
        if (minion.countingdown <=0) {
            minion.countingdown = minion.frequency;
            addBullet(spawnBullet(minion, alien_center_x, alien_center_y));
        }
      });
      //console.log("alien pos:", alien.pos, idx, individualWidth);
  }, [timeClock])

  useEffect(() => {
    dispatch(signalAlien());
  }, []);
  return(<>abc</>);
}


