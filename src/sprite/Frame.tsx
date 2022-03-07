import React, {useEffect, MutableRefObject } from 'react';
import { useAppSelector, useAppDispatch } from '../app/hooks';
import { individualWidth } from "../data/draw";
import {
  selectTimeClock,
  resetBullets,
  addBullet,
  signalBulletsUpdate,
  selectBullets,
  signalAlien,
  switchView,
  addEvent,
  selectAlien,
  selectViewIndex,
} from '../dynamic/dynamicSlice';
import { Sprite } from './sprite';
import { BsPrefixComponent } from 'react-bootstrap/esm/helpers';
import getWorld from '../data/world';
import { AlienEvent } from '../dynamic/event';

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
  const bullets = useAppSelector(selectBullets);
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
      for (var b of bullets) {
        /*if (Math.abs(b.x-pos-43) + Math.abs(b.y - 340) <20) {
          if (canvas) {canvas!.fillStyle = "#ff0000"};
          canvas?.arc(b.x, b.y, 10,0,360, true);
        } else*/ {
          canvas?.save();
          canvas?.translate(b.x, b.y);
          let angle = Math.atan(b.x-pos-50) / (380-b.y)*180/Math.PI;
          canvas?.rotate(angle + 90);
          let img = prop.minion.getFrame("missle",0);
          canvas?.drawImage(img,0,0,16,7)
          canvas?.restore();
        }
      }
      dispatch(signalBulletsUpdate([pos+50, 300+40]));
      let idx = Math.floor(alien.pos / individualWidth);
      if (viewIndex != idx) {
        dispatch(switchView(idx));
        dispatch(resetBullets());
        dispatch(addEvent(AlienEvent(alien, getWorld().getInstance(idx))));
      }
      minions.map((m,i) => {
        prop.minion?.paint(prop.canvasRef?.current!, m.x, m.y, timeClock);
        m.countingdown--;
        if (m.countingdown <=0) {
            m.countingdown = m.frequency;
            dispatch(addBullet({x:m.x+10, y:m.y+10, source:m.home, power:m.power}));
        }
      });
      //console.log("alien pos:", alien.pos, idx, individualWidth);
  }, [timeClock])

  useEffect(() => {
    dispatch(signalAlien("run"));
  }, []);
  return(<>abc</>);
}


