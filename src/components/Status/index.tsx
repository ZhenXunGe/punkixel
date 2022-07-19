import React, { useEffect, useState } from 'react';
import { useAppSelector, useAppDispatch } from '../../app/hooks';
import {
  selectEnergy,
  selectPunkixel,
  selectRank,
  selectContribution,
  selectReward,
  selectPPH,
  updateStatus,
  selectPlayer,
} from '../../data/statusSlice';
import './style.scss';
import {
   selectTimeClock, selectViewIndex,
} from '../../dynamic/dynamicSlice';

export function Status () {
  const dispatch = useAppDispatch();
  const timeClock = useAppSelector(selectTimeClock);
    const energy = useAppSelector(selectEnergy);
    const punkixel = useAppSelector(selectPunkixel);
    const ranking = useAppSelector(selectRank);
    const pph = useAppSelector(selectPPH);
    const player = useAppSelector(selectPlayer)!;
    const voucher = player.voucher;
    const contribution = useAppSelector(selectContribution);
    const reward = useAppSelector(selectReward);
    const viewIndex = useAppSelector(selectViewIndex);
    useEffect(() => {
      dispatch(updateStatus())
    }, [timeClock])
  return (
    <div className="status">
        <ul>
        <li>{viewIndex}</li>
        <li>{energy}</li>
        <li>{punkixel}</li>
        <li>{ranking.current}</li>
        <li>{voucher}</li>
        <li>{contribution}</li>
        <li>{reward}</li>
        <li>{pph}</li>
        </ul>
    </div>
  );
}
