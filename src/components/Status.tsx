import React, { useState } from 'react';
import { useAppSelector, useAppDispatch } from '../app/hooks';
import {
  action,
  selectEnergy,
} from './statusSlice';


import './Component.css';

export function Status () {
    const energy = useAppSelector(selectEnergy);
  return (
    <div className="status">
        <ul>
        <li>Energy: {energy}</li>
        <li>Punkixel: 100</li>
        <li>Rate: 100</li>
        <li>Voucher: 1</li>
        <li>PPH: 20</li>
        </ul>
    </div>
  );
}
