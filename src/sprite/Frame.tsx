import React, { useEffect, MutableRefObject, useState } from 'react';
import { useAppSelector, useAppDispatch } from '../app/hooks';
import { individualWidth } from "../data/draw";
import {
  selectTimeClock,
  signalBulletsUpdate,
  signalAlien,
  switchView,
  selectAlien,
  selectViewIndex,
} from '../dynamic/dynamicSlice';
import { Sprite } from './sprite';
import { getDynamicInfo, DynamicMinion, spawnBullet } from '../dynamic/dynamicSlice';
import { getSprite } from './spriteSlice';

interface IProps {
  minion: Sprite;
  canvasRef: MutableRefObject<HTMLCanvasElement | undefined>;
}

export default function Frame(prop: IProps) {
  let ratio = 4;
  const timeClock = useAppSelector(selectTimeClock);
  const dispatch = useAppDispatch();
  const viewIndex = useAppSelector(selectViewIndex);
  const alien = useAppSelector(selectAlien);
  const monster = getSprite(alien.sprite);
  useEffect(() => {
    let dynamic = getDynamicInfo();
    let minions = dynamic.getMinions();
    let state = alien.status;
    monster.setState(state);
    let canvas = prop.canvasRef?.current!.getContext("2d");
    let pos = (alien.pos % (individualWidth)) * ratio;
    canvas?.clearRect(0, 0, 1000, 400);

    let alien_center_x = pos + 60;
    let alien_center_y = 330;
    dispatch(signalBulletsUpdate([alien_center_x, alien_center_y]));

    let idx = Math.floor(alien.pos / individualWidth);
    if (viewIndex != idx) {
      dispatch(switchView(idx));
      dynamic.resetBullets([]);
    }


    // Render minions
    minions.map((m: DynamicMinion) => {
      let minion = m.minion;
      let spriteName = `${minion.type}${minion.style}`;
      prop.minion?.paintAtClip(prop.canvasRef?.current!,
        spriteName,
        minion.x + m.offsetX,
        minion.y + m.offsetY,
        m.currentFrame,
      );
      m.countingdown--;
      if (m.countingdown <= 0) {
        m.countingdown = minion.frequency;
        dynamic.addBullet(spawnBullet(m, alien_center_x, alien_center_y, m.offsetX, m.offsetY));
      }
      dynamic.updateMinionPosition(m, alien_center_x);
    });

    // render Monsters
    monster?.paint(prop.canvasRef?.current!, pos, 285, timeClock);

    // render Bullets
    for (var b of dynamic.allBullets()) {
      b.paint(canvas!, prop.minion);
    }

    dispatch(signalAlien());
    //console.log("alien pos:", alien.pos, idx, individualWidth);
  }, [timeClock])

  useEffect(() => {
    dispatch(signalAlien());
  }, []);
  return(<></>);
}


