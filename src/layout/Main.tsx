import React, { useEffect } from 'react';
import { useAppSelector, useAppDispatch } from '../app/hooks';
import { LeftMenu } from '../components/LeftMenu/LeftMenu';
import { RightPanel } from './RightPanel';
import { spriteIsLoaded, spriteNeedLoaded, spriteLoaded } from '../sprite/spriteSlice';
import { updateTimeClockAsync } from '../dynamic/dynamicSlice';
import getWorld from '../data/world';
import bg from '../images/punkixel.png';
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
      <div className="application" style={{backgroundImage:'url('+bg+')'}}>
      <LeftMenu></LeftMenu>
      <RightPanel key="right-panel"></RightPanel>
      </div>
    )
  } else { 
    return(<div>loading {loaded} {needload}</div>);
  }
}
