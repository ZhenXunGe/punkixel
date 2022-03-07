import React, { useEffect, useState } from 'react';
import { useAppSelector, useAppDispatch } from '../app/hooks';
import { LeftMenu } from '../components/LeftMenu';
import { RightPanel } from './RightPanel';
import { spriteIsLoaded, spriteNeedLoaded, spriteLoaded } from '../sprite/spriteSlice';
import { updateTimeClockAsync } from '../dynamic/dynamicSlice';
export function Main() {
  const dispatch = useAppDispatch();
  useEffect(() => {
    setInterval(function () {dispatch(updateTimeClockAsync(0))}, 80);
  }, [])
  const loaded = useAppSelector(spriteLoaded);
  const isloaded = useAppSelector(spriteIsLoaded);
  const needload = useAppSelector(spriteNeedLoaded);
  if(isloaded === true) {
    return (
      <div className="application">
      <LeftMenu></LeftMenu>
      <RightPanel key="right-panel"></RightPanel>
      </div>
    )
  } else { 
    return(<div>loading {loaded} {needload}</div>);
  }
}
