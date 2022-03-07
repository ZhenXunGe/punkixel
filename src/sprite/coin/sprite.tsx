import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { individualWidth } from "../../data/draw";
import getWorld from "../../data/world";
import { selectTimeClock, selectViewIndex } from "../../dynamic/dynamicSlice";
import coin from "./punkxiel.gif";

export default function LoadSprite() {
  let ratio = 4;
  const dispatch = useAppDispatch();
  const viewIndex = useAppSelector(selectViewIndex);
  const [drops, setDrops] = useState<number[]>([]);
  const timeClock = useAppSelector(selectTimeClock);
  useEffect(() => {
      //console.log(drops);
      setDrops(getWorld().getInstance(viewIndex*individualWidth).info.drops);
  }, [timeClock]);
  return (
  <div className="drop">
    <div className="body">
      {drops.map((pos, i) => (
      <img style={{height:20, width:20, left:pos * ratio}} key={`drop-coin-${i}`} src={coin}></img>
      ))}
    </div>
  </div>
  );
}