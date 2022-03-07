import React, { useState } from 'react';
import { useAppSelector, useAppDispatch } from '../app/hooks';
import {
  action,
  selectEnergy,
  selectPunkixel,
  selectRanking,
  selectVoucher,

  selectReward,
  selectPPH,
} from '../data/statusSlice';

import {
  selectContribution, selectViewIndex,
} from '../dynamic/dynamicSlice';

export function Status () {
    const energy = useAppSelector(selectEnergy);
    const punkixel = useAppSelector(selectPunkixel);
    const ranking = useAppSelector(selectRanking);
    const pph = useAppSelector(selectPPH);
    const voucher = useAppSelector(selectVoucher);
    const contribution = useAppSelector(selectContribution);
    const reward = useAppSelector(selectReward);
    const viewIndex = useAppSelector(selectViewIndex);
  return (
    <div className="status">
        <ul>
        <li>View: {viewIndex}</li>
        <li>Energy: {energy}</li>
        <li>Punkixel: {punkixel}</li>
        <li>Ranking: {ranking}</li>
        <li>Voucher: {voucher}</li>
        <li>Contribution: {contribution}</li>
        <li>Reward: {reward}</li>
        <li>PPH: {pph}</li>
        </ul>
    </div>
  );
}
