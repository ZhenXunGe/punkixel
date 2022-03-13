import React, { useEffect } from 'react';
import { useAppSelector, useAppDispatch } from '../app/hooks';
import { LeftMenu } from '../components/LeftMenu';
import { RightPanel } from './RightPanel';
import { spriteIsLoaded, spriteNeedLoaded, spriteLoaded } from '../sprite/spriteSlice';
import { updateTimeClockAsync } from '../dynamic/dynamicSlice';
import getWorld from '../data/world';
export function Main() {
  const dispatch = useAppDispatch();
  useEffect(() => {
    setInterval(function () {dispatch(updateTimeClockAsync(0))}, 80);
  }, [])
  const loaded = useAppSelector(spriteLoaded);
  const isloaded = useAppSelector(spriteIsLoaded);
  const needload = useAppSelector(spriteNeedLoaded);
  if(isloaded === true && getWorld()!=undefined) {
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
