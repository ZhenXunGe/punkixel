import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { individualWidth } from "../../data/draw";
import { selectViewIndex, selectWorld } from "../../data/statusSlice";
import { selectTimeClock } from "../../timer/timeSlice";
import coin from "./punkxiel.gif";

export default function LoadSprite() {
  let ratio = 4;
  const dispatch = useAppDispatch();
  const world = useAppSelector(selectWorld);
  const viewIndex = useAppSelector(selectViewIndex);
  const [drops, setDrops] = useState(world.getInstance(viewIndex*individualWidth).info.drops);
  const timeClock = useAppSelector(selectTimeClock);
  useEffect(() => {
      //console.log(drops);
      setDrops(world.getInstance(viewIndex*individualWidth).info.drops);
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