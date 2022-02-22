import React, { useState, useEffect, useRef, MutableRefObject } from 'react';
import { useAppSelector, useAppDispatch } from '../app/hooks';
import { individualWidth } from "../data/draw";
import {
  selectTimeClock,
  resetBullets,
  addBullet,
  signalBulletsUpdate,
  selectBullets,
  bulletAngle,
} from '../timer/timeSlice';
import { selectAlien, switchView, signalAlien, selectViewIndex, selectWorld, selectLocalMinions } from '../data/statusSlice';
import { Sprite } from './sprite';
import { BsPrefixComponent } from 'react-bootstrap/esm/helpers';
import { pointsOnBezierCurves } from 'points-on-curve';

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
  const world = useAppSelector(selectWorld);
  const minions = useAppSelector(selectLocalMinions);

  useEffect(() => {
      let state = alien.status;
      prop.monster.setState(state);
      let canvas = prop.canvasRef?.current!.getContext("2d");
      let pos = (alien.pos % (individualWidth)) * ratio;
      canvas?.clearRect(0,0, 900,400);
      prop.monster?.paint(prop.canvasRef?.current!, pos, 300, timeClock);
      dispatch(signalAlien(state));
      for (var b of bullets) {
          canvas?.save();
          canvas?.translate(b.x, b.y);
          let angle = bulletAngle(b);
          canvas?.rotate(angle);
          let img = prop.minion.getFrame("missle",0);
          canvas?.drawImage(img,0,0,16,7)
          canvas?.restore();
      }

      dispatch(signalBulletsUpdate([pos+50, 300+40]));
      let idx = Math.floor(alien.pos / individualWidth);
      if (viewIndex != idx) {
        dispatch(switchView(idx));
        dispatch(resetBullets());
      }
      
      minions.map((m,i) => {
        prop.minion?.paint(prop.canvasRef?.current!, m.x, m.y, timeClock);
        m.countingdown--;
        if (m.countingdown <=0) {
            m.countingdown = m.frequency;
            let x = m.x+10;
            let y = m.y+10;
            // TODO: hitPt needs to be calculated.
            let hitPt: [number, number] = [pos+320, 300+40];

            let track = pointsOnBezierCurves([[x, y],[(x+hitPt[0])/3 + 50, (y+hitPt[1])/3 - 150], [(x+2*hitPt[0])/3 + 50, (y+2*hitPt[1])/3 - 150], hitPt]);
            // console.log("bullet track:", track);
            dispatch(addBullet({x:x, y:y, source:m.home, power:m.power, tx: hitPt[0], ty: hitPt[1], track: track, ti: 0}));
        }
      });
      //console.log("alien pos:", alien.pos, idx, individualWidth);
  }, [timeClock])

  useEffect(() => {
    dispatch(signalAlien("run"));
  }, []);
  return(<>abc</>);
}


