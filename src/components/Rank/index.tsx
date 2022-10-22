import React, { useEffect, useState } from 'react';
import { HandlerProxy } from '../../layout/handlerProxy';
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import {addressAbbreviation} from "../../utils/address";
import './style.scss';
import rank1 from '../../images/rank/2.png';
import rank2 from '../../images/rank/3.png';
import rank3 from '../../images/rank/4.png';
import rank4 from '../../images/rank/5.png';
import rank5 from '../../images/rank/6.png';

import {
  loadRank,
  selectPlayer,
  selectRank,
} from '../../data/statusSlice';

import {
  getWorld
} from '../../data/world';
const ranktitles = [rank1,rank2,rank3,rank4,rank5];
interface RankPanelProp {
  handlerProxy: HandlerProxy;
}

export function RankPanel(props: RankPanelProp) {
  const dispatch = useAppDispatch();
  const player = useAppSelector(selectPlayer)!;
  useEffect(()=>{
    dispatch(loadRank(player.id));
  },[]);

  const rank = useAppSelector(selectRank);
  return (
    <>
    <div className="rank-board" key="main-board">
      {rank.instances.map((ins, i) => {
        let playerTotal = getWorld().getPlayer(ins.owner).total
        if (i==0) {return <></>}
        else {
        return(<div className="rank-item">
          <img src={ranktitles[i-1]}></img>
          <div className="address"> {addressAbbreviation(ins.owner, 8)} </div>
          <div className="punkixel-earned"> {ins.reward + playerTotal}</div>
          <div className="punkixel-pph"> {ins.pph} </div>
        </div>);
        }
      })}
    </div>
    </>
  );
}


