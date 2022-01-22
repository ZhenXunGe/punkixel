import React, { useState, useRef, useEffect } from 'react';
import { useAppSelector, useAppDispatch } from './app/hooks';
import logo from './logo.svg';
import { LeftMenu } from './components/LeftMenu';
import { RightPanel } from './layout/RightPanel';

import './App.css';

import {
    selectTimeClock,
    updateTimeClockAsync,
} from './data/statusSlice';



function App() {
  const dispatch = useAppDispatch();
  const timeclock = useAppSelector(selectTimeClock);
  useEffect(() => {
    dispatch(updateTimeClockAsync(0));
  }, [timeclock])

  return (
    <>
    <LeftMenu></LeftMenu>
    <RightPanel></RightPanel>
    </>
  );
}

export default App;
