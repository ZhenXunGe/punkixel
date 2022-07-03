import React, { useState } from 'react';
import { HandlerProxy } from '../../layout/handlerProxy';
import './style.scss';
interface RankPanelProp {
  handlerProxy: HandlerProxy;
}

export function RankPanel(props: RankPanelProp) {
  return (
    <>
    <div className="rank-board" key="main-board">
      <div className="rank-item">
      <div className="address"> 0xACE120...E32C </div>
        <div className="punkixel-earned"> 1231241 </div>
        <div className="punkixel-pph"> 123145 </div>
      </div>
      <div className="rank-item">
      <div className="address"> 0xACE120...E32C </div>
        <div className="punkixel-earned"> 1231241 </div>
        <div className="punkixel-pph"> 123145 </div>
      </div>
      <div className="rank-item">
      <div className="address"> 0xACE120...E32C </div>
        <div className="punkixel-earned"> 1231241 </div>
        <div className="punkixel-pph"> 123145 </div>
      </div>
      <div className="rank-item">
      <div className="address"> 0xACE120...E32C </div>
        <div className="punkixel-earned"> 1231241 </div>
        <div className="punkixel-pph"> 123145 </div>
      </div>
      <div className="rank-item">
        <div className="address"> 0xACE120...E32C </div>
        <div className="punkixel-earned"> 1231241 </div>
        <div className="punkixel-pph"> 123145 </div>
      </div>
    </div>
    </>
  );
}


