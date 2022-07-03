import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './style.scss';
import FRAME from '../../images/layout/frame.png';
export function RankTop() {
  return (
    <div className="rank-top">
      <div className ="top-info">
        <div className="address"> 0xACE120...E32C </div>
        <div className="punkixel-earned"> 1231241 </div>
        <div className="punkixel-pph"> 123145 </div>
      </div>
      <div className="thumbnail-frame">
        <img src={FRAME}></img>
      </div>
    </div>
  );
}
