import React, { useState, useRef, useEffect } from 'react';
import { useAppSelector, useAppDispatch } from './app/hooks';
import { LeftMenu } from './components/LeftMenu';
import { RightPanel } from './layout/RightPanel';

import './App.css';

import {
    selectTimeClock,
    updateTimeClockAsync,
} from './timer/timeSlice';



function App() {
  const dispatch = useAppDispatch();
  useEffect(() => {
    setInterval(function () {dispatch(updateTimeClockAsync(0))}, 80);
  }, [])

  return (
    <div className="screen">
      <div className="application">
      <LeftMenu></LeftMenu>
      <RightPanel key="right-panel"></RightPanel>
      </div>
    </div>
  );
}

export default App;
