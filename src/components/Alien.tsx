import React, { useState, useEffect } from 'react';
import { useAppSelector, useAppDispatch } from '../app/hooks';
import './Component.css';
import { individualWidth } from "../data/draw"

import {
    contribute,
    selectAlien,
    switchView,
    selectViewIndex,
    updateAlienAsync,
} from '../data/statusSlice';

export function AlienItem() {
  const dispatch = useAppDispatch();
  const alien = useAppSelector(selectAlien);
  const viewIndex = useAppSelector(selectViewIndex);
  function attackEvent(e:any) {
    dispatch(contribute());
  }

  useEffect(() => {
    dispatch(updateAlienAsync(0));
    let idx = Math.floor(alien.pos / individualWidth);
    dispatch(switchView(idx));
    console.log("alien pos:", alien.pos, idx);
  }, [alien])
  return (
    <div className="alien" style={{left: (4 * (alien.pos % individualWidth) + 300) + "px"}}>
        <div className="health">
        </div>
        <div className="body" onClick={(e) => {attackEvent(e);}} >
        </div>
    </div>
  );
}

