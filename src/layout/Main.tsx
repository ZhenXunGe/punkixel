import React, { useEffect } from 'react';
import { useAppSelector, useAppDispatch } from '../app/hooks';
import { LeftMenu } from '../components/LeftMenu';
import { RightPanel } from './RightPanel';
import { spriteIsLoaded, spriteNeedLoaded, spriteLoaded, spriteNumber } from '../sprite/spriteSlice';
import { updateTimeClockAsync } from '../dynamic/dynamicSlice';
import getWorld from '../data/world';
import { propTypes } from 'react-bootstrap/esm/Image';
interface loadingStatus {
  totalSprites:number,
}
export function Main(prop: loadingStatus) {
  const dispatch = useAppDispatch();
  useEffect(() => {
    setInterval(function () {dispatch(updateTimeClockAsync(0))}, 80);
  }, [])
  const isloaded = useAppSelector(spriteIsLoaded);
  const loaded = useAppSelector(spriteLoaded);
  const needload = useAppSelector(spriteNeedLoaded);
  const total = useAppSelector(spriteNumber);
  if(isloaded === true && getWorld()!=undefined && total === prop.totalSprites) {
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
