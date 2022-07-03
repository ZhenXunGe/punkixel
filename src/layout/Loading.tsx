import React, {createRef, useState, useEffect, useRef } from 'react';
import { useAppSelector, useAppDispatch } from '../app/hooks';
import { spriteNeedLoaded, spriteLoaded, setLoaded } from '../sprite/spriteSlice';
import { selectTimeClock } from '../dynamic/dynamicSlice';

import P1 from "../images/loading/1_game_store.png";
import P2 from "../images/loading/2_green_buikding.png";
import P3 from "../images/loading/3_asian_style_house.png";
import P4 from "../images/loading/4_purple_house.png";
import P5 from "../images/loading/5_back_bridge.png";
import P6 from "../images/loading/6_back_green_building.png";
import P7 from "../images/loading/7_orange_house.png";
import P8 from "../images/loading/8_lion_tower.png";
import P9 from "../images/loading/9_3boxes.png";
import P10 from "../images/loading/10_front_bridge.png";
import P11 from "../images/loading/11_red_hotel.png";
import P12 from "../images/loading/12_blue_sign.png";
import P13 from "../images/loading/13_blue_wire.png";
import P14 from "../images/loading/14_purple_power_house.png";
import P15 from "../images/loading/15_department.png";
import P16 from "../images/loading/16_eletrnic.png";
import P17 from "../images/loading/17_bottle.png";
import P18 from "../images/loading/18_robbot_arm.png";
import P19 from "../images/loading/19_in_front_charge.png";
import P20 from "../images/loading/20_liquid.png";
import P21 from "../images/loading/21_back_purple_house.png";
import P22 from "../images/loading/22_box_house.png";
import P23 from "../images/loading/23_3color_building.png";
import P24 from "../images/loading/24_charge.png";
import P25 from "../images/loading/25_bottle_small.png";
import P26 from "../images/loading/26_back_red.png";
import P27 from "../images/loading/27_green_line.png";
import P28 from "../images/loading/28_rainbow_apartment.png";
import P29 from "../images/loading/29_pink_hotel.png";
import P30 from "../images/loading/30_ad_building.png";
import P31 from "../images/loading/31_orange_restaurant.png";
import P32 from "../images/loading/32_yellow_hotel.png";
import P33 from "../images/loading/33_back_blue_house.png";
import P34 from "../images/loading/34_back_green.png";
import P35 from "../images/loading/35_blue_house.png";
import P36 from "../images/loading/36_tv_room.png";
import P37 from "../images/loading/37_purple_liquid_building.png";
import P38 from "../images/loading/38_back_blue_hotel.png";


import COVER from "../images/loading/cover.png";


import {
  selectL1Account,
  loginL1AccountAsync,
} from "../data/accountSlice";

import {
  loadWorld,
  worldLoaded,
} from "../data/statusSlice";
const import_progress_images = [
        P1, P2, P3, P4, P5, P6, P7, P8, P9, P10,
        P11, P12, P13, P14, P15, P16, P17, P18, P19, P20,
        P21, P22, P23, P24, P25, P26, P27, P28, P29, P30,
        P31, P32, P33, P34, P35, P36, P37, P38 ];

interface BC {
  r: number;

}

function ProgressBar(props: BC) {
  let account = useAppSelector(selectL1Account);
  if (account) {
    console.log("connected", account);
    return (
    <>
    <img key={`loading-cover`} src={COVER}></img>
    <div className="loading-bar">
      <div className="progress" style={{
        width: Math.floor(props.r * 620 + 2)
      }}>
      </div>
    </div>
    <div className="loading-bar-cover"></div>
    </>
    );
  } else {
    return (<></>);
  }
}

function Connect() {
  let account = useAppSelector(selectL1Account);
  const dispatch = useAppDispatch();
  const connect = () => {
    dispatch(loginL1AccountAsync());
  };

  if (!account) {
    return(
    <>
    <img key={`loading-cover`} src={COVER}></img>
    <div className="connect-account">
        <div onClick={() => connect()}>connect account</div>
    </div>
    </>
    );
  } else {
    console.log("connected", account);
    return (<></>);
  }

}


export function Loading() {
  const loaded = useAppSelector(spriteLoaded);
  const needload = useAppSelector(spriteNeedLoaded);
  const wloaded = useAppSelector(worldLoaded);
  let account = useAppSelector(selectL1Account);
  let timeClock = useAppSelector(selectTimeClock);
  const dispatch = useAppDispatch();
  const [delta, setDelta] = useState(0);
  const [r, setR] = useState(0);
  const [progress, setProgress] = useState(0);
  useEffect(() => {
    if (account) {
      let r = delta / 50;
      if (r > 1) {
        r = 1;
      }
      setProgress(r * loaded / needload);
      if (r === 1) {
        dispatch(setLoaded());
      }
      setR(r);
      setDelta(delta + 1);
    };
  }, [timeClock]);
  useEffect(()=>{dispatch(loadWorld())},[])
  return (<div className="loading">
    {
      import_progress_images.map((url, i) => {
        if (i * 2 < progress * 100) {
          return (<img key={`loading-progress-${i}`} src={url}></img>);
        } else {
          return <></>;
        }
      })
    }
    <ProgressBar r = {r}></ProgressBar>
    <Connect></Connect>
  </div>);
}
