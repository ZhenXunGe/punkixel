import React, { useState } from 'react';
import { useAppSelector} from '../../app/hooks';
import './style.scss';
import {
  selectDye
} from '../../data/statusSlice';
import { ofDyeIndex } from '../../server/palette';

function formatColor(color: Array<number>) {
  return `#${color[0].toString(16)}${color[1].toString(16)}${color[2].toString(16)}`;
}

function formatColorR(color: Array<number>) {
  return `#${color[0].toString(16)}0000`;
}

function formatColorG(color: Array<number>) {
  return `#00${color[1].toString(16)}00`;
}

function formatColorB(color: Array<number>) {
  return `#0000${color[2].toString(16)}`;
}






export function Market() {
  let dye = useAppSelector(selectDye);
  console.log(dye);
  return (
    <div className="market-board">
      <div className="rgb-element">
            <div className="color" style={{backgroundColor: formatColor(ofDyeIndex(dye).color)}}></div>
            <div className="cover"></div>
      </div>
      <div className="rgb-element">
            <div className="color" style={{backgroundColor: formatColorR(ofDyeIndex(dye).color)}}></div>
            <div className="cover"></div>
      </div>
      <div className="rgb-element">
            <div className="color" style={{backgroundColor: formatColorG(ofDyeIndex(dye).color)}}></div>
            <div className="cover"></div>
      </div>
      <div className="rgb-element">
            <div className="color" style={{backgroundColor: formatColorB(ofDyeIndex(dye).color)}}></div>
            <div className="cover"></div>
      </div>


    </div>
  );
}

