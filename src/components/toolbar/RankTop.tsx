import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './style.scss';
import FRAME from '../../images/layout/frame.png';
import { useAppSelector } from '../../app/hooks';
import { selectPlayer, selectRank } from '../../data/statusSlice';
import { addressAbbreviation } from '../../utils/address';
import { getWorld } from '../../data/world';
import { SingleThumbnail } from "../Thumbnail";
export function RankTop() {
  const rank = useAppSelector(selectRank).instances;
  const player = useAppSelector(selectPlayer)!;
  const current = getWorld().getInstanceByIndex(player.homeIndex);
  return (
    <div className="rank-top">
      <div className ="top-info">
        {rank.length ==0 ? <></> : <>
        <div className="address"> {addressAbbreviation(rank[0].owner, 4)} </div>
        <div className="punkixel-earned"> {rank[0].reward} </div>
        <div className="punkixel-pph"> {rank[0].pph} </div>
        </>
        }
      </div>
      <div className="thumbnail-frame">
        <SingleThumbnail></SingleThumbnail>
        <img src={FRAME}></img>
        <div className="address"> {addressAbbreviation(player.id, 4)} </div>
        <div className="punkixel-earned"> {current.info.reward} </div>
        <div className="punkixel-pph"> {current.info.pph} </div>
      </div>
    </div>
  );
}
