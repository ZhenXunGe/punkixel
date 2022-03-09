import React, {useEffect, MutableRefObject } from 'react';
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
import { BsPrefixComponent } from 'react-bootstrap/esm/helpers';
import getWorld from '../data/world';
import { AlienEvent } from '../dynamic/event';
import { TrackBullet } from '../dynamic/bullet';

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

  const viewIndex = useAppSelector(selectViewIndex);

  useEffect(() => {
      let instance = getWorld().getInstance(viewIndex*individualWidth);
      let minions = instance.info.minions;
      let state = alien.status;
      prop.monster.setState(state);
      let canvas = prop.canvasRef?.current!.getContext("2d");
      let pos = (alien.pos % (individualWidth)) * ratio;
      canvas?.clearRect(0,0, 900,400);
      prop.monster?.paint(prop.canvasRef?.current!, pos, 300, timeClock);
      dispatch(signalAlien(state));
      for (var b of allBullets()) {
        /*if (Math.abs(b.x-pos-43) + Math.abs(b.y - 340) <20) {
          if (canvas) {canvas!.fillStyle = "#ff0000"};
          canvas?.arc(b.x, b.y, 10,0,360, true);
        } else*/ {
          b.paint(canvas!, prop.minion);
        }
      }
      let alien_center_x = pos + 50;
      dispatch(signalBulletsUpdate([alien_center_x, 300+40]));
      let idx = Math.floor(alien.pos / individualWidth);
      if (viewIndex != idx) {
        dispatch(switchView(idx));
        resetBullets();
        dispatch(addEvent(AlienEvent(alien, getWorld().getInstance(idx))));
      }
      minions.map((m,i) => {
        prop.minion?.paint(prop.canvasRef?.current!, m.x, m.y, timeClock);
        m.countingdown--;
        if (m.countingdown <=0) {
            m.countingdown = m.frequency;
            let rotate = 0;
            if (m.x > alien_center_x) {
              rotate = 180;
            }
            addBullet(new TrackBullet(m.x+20, m.y+20, 20, m.power, 0, rotate, m.home));
        }
      });
      //console.log("alien pos:", alien.pos, idx, individualWidth);
  }, [timeClock])

  useEffect(() => {
    dispatch(signalAlien("run"));
  }, []);
  return(<>abc</>);
}


