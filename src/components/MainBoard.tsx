import React, { useState } from 'react';
import { useAppSelector, useAppDispatch } from '../app/hooks';
import {
  action,
  selectEnergy,
} from '../data/statusSlice';
import styles from './Counter.module.css';


export function MainBoard () {
  const dispatch = useAppDispatch();
  return (
    <div onClick={() => dispatch(action())} className="main-board">
    </div>
  );
}
