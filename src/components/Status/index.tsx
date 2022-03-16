import React, { useEffect, useState } from 'react';
import { useAppSelector, useAppDispatch } from '../../app/hooks';
import {
  selectEnergy,
  selectPunkixel,
  selectRanking,
  selectVoucher,
  selectContribution,
  selectReward,
  selectPPH,
  updateStatus,
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
    const ranking = useAppSelector(selectRanking);
    const pph = useAppSelector(selectPPH);
    const voucher = useAppSelector(selectVoucher);
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
        <li>{ranking}</li>
        <li>{voucher}</li>
        <li>{contribution}</li>
        <li>{reward}</li>
        <li>{pph}</li>
        </ul>
    </div>
  );
}
