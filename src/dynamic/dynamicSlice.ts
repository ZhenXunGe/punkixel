import { createAsyncThunk, createSlice} from '@reduxjs/toolkit';
import { RootState } from '../app/store';
import { randomAlien } from '../data/alien';
import { individualWidth } from '../data/draw';
import { Minion, MinionType, Alien } from '../../server/types';
import { getWorld } from '../data/world';
import { Sprite } from '../sprite/sprite';
import { getSprite } from '../sprite/spriteSlice';
import { InstanceInfo } from '../data/instance';
import { Reaction } from '../data/weather';
import { BombBullet, BulletInfo, StraightBullet, TrackBullet } from "./bullet";
import { DynamicState } from "../../server/simulate";
import { punkixelEndpoint } from "../data/endpoint";

function generateBulletPos(t:MinionType) {
  if(t==="ufo") {
    return [25,40];
  } else if (t==="land") {
    return [25,15];
  } else if (t==="airballoon") {
    return [25,35];
  } else {
    return [0,0];
  }
}

export class DynamicMinion {
  minion: Minion;
  offsetX: number;
  offsetY: number;
  bulletPos: number[];
  countingdown: number;
  currentFrame: number;
  constructor(minion: Minion) {
    this.minion = minion;
    this.offsetX = 0;
    this.offsetY = 0;
    this.currentFrame = 0;
    this.bulletPos = generateBulletPos(minion.type);
    this.countingdown = 2;
  }
}

export function spawnBullet(m:DynamicMinion, alien_x:number, alien_y:number, offsetX:number, offsetY:number):BulletInfo {
  let start_x = m.minion.x + m.bulletPos[0] + offsetX;
  let start_y = m.minion.y + m.bulletPos[1] + offsetY;
  if (m.minion.modifier[0] == "missle") {
    let rotate = 0;
    if (m.minion.x > alien_x) {
      rotate = 180;
    }
    return new TrackBullet(start_x, start_y, 20, m.minion.power, m.minion.modifier[1], 0, rotate, m.minion.id);
  } else if (m.minion.modifier[0] == "bomb") {
    let rotate = Math.atan2(alien_y - m.minion.y, alien_x - m.minion.x)*180/Math.PI;
    return new BombBullet(start_x, start_y, 10, m.minion.power, m.minion.modifier[1], 20, rotate, m.minion.id);
  }
  return new StraightBullet(start_x, start_y, 20, m.minion.power, m.minion.modifier[1], 20, 0, m.minion.id);
}


class DynamicInfo {
  bullets: Array<BulletInfo> = [];
  minions: Array<DynamicMinion> = [];

  addBullet(d:BulletInfo) {
    this.bullets.push(d);
  };

  resetBullets(bullets: Array<BulletInfo>) {
    this.bullets = bullets;
  };

  allBullets() {
    return this.bullets;
  };

  loadInstance(instance: InstanceInfo) {
    this.minions = instance.minions.map((mid)=>{
      let minfo = getWorld().getMinion(mid);
      return new DynamicMinion(minfo);
    });
  }

  getMinions() {
    return this.minions;
  }

  updateMinionPosition(minion: DynamicMinion, targetX: number) {
    if (minion.minion.type !== "land") {
      let m = minion.minion;
      let pos_x = minion.offsetX + m.x + (1 - Math.floor(Math.random() * 3)) * 5;
      if (pos_x < 0) { pos_x = 0; };
      if (pos_x > 900) { pos_x = 900; };
      minion.offsetX = pos_x - m.x;
      minion.currentFrame = Math.abs(minion.offsetX % 2);
    } else {
      let m = minion.minion;
      let pos_x = minion.offsetX + m.x + (1 - Math.floor(Math.random() * 3)) * 5;
      if (pos_x < 0) { pos_x = 0; };
      if (pos_x > 900) { pos_x = 900; };
      minion.offsetX = pos_x - m.x;
      let indexBase = pos_x > targetX ? 0 : 3
      minion.currentFrame = Math.abs(minion.offsetX%3) + indexBase;
    }
  }

  getFocus(x:number, y: number): DynamicMinion | null {
    let close = 100000;
    for(var m of this.minions) {
      let centerX = m.minion.x + m.offsetX+20;
      let centerY = m.minion.y + m.offsetY+20;
      let dis = Math.sqrt((x-centerX)*(x-centerX) + (y-centerY)*(y-centerY));
      if (dis<20) {
        return m;
      }
    }
    return null;
  }
}

var dynamicInfo: DynamicInfo | null = null;

export function getDynamicInfo(): DynamicInfo {
  if (dynamicInfo === null) {
    dynamicInfo = new DynamicInfo();
    dynamicInfo.loadInstance(getWorld().getInstanceByIndex(0).info);
  };
  return dynamicInfo!;
}


export interface SketchState {
    sketchSignal: number;
    sketchDynamic: number;
    reaction: Reaction | null;
    cursor: string;
}

const initialSketchState: SketchState = {
  sketchSignal: 0,
  sketchDynamic: 0,
  reaction: null,
  cursor: "cursorDefault",
}

export interface DynamicGameState {
    dynamic: DynamicState;
    sketch: SketchState;
}

interface SimulateState {
  dynamicState: DynamicState;
}

const initialState: DynamicGameState = {
    dynamic: {
      timeClock:0,
      events:[],
      alien: randomAlien(),
      upcomingAlien: randomAlien(),
      viewIndex:0,
      totalInstance: 0,
      damage: 0,
    },
    sketch: initialSketchState,
}


async function syncDynamic () {
    let info: SimulateState = await punkixelEndpoint.invokeRequest("GET", "info", null);
    return info;
}

export const loadDynamic = createAsyncThunk(
  'dynamic/updateDynamicState',
  async (thunkApi) => {
    let r = await syncDynamic();
    console.log("dynamic initialized");
    return r;
  }
);


function timeout(ms:number) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

export const updateTimeClockAsync = createAsyncThunk(
    'dynamic/updateTimeClockAsync',
    async (timerId:number, thunkAPI) => {
      return 1;
    }
)

export const dynamicSlice = createSlice({
  name: 'dynamic',
  initialState,
  reducers: {
    addEvent: (state, d) => {
      state.dynamic.events.unshift(d.payload);
    },
    setCursor: (state, d) => {
      state.sketch.cursor = d.payload;
    },
    signalSketch: (state) => {
      state.sketch.sketchSignal ++;
    },
    signalDynamic: (state) => {
      state.sketch.sketchDynamic ++;
    },

    signalBulletsUpdate: (state, d) => {
      let cs = [];
      let cor:[number, number] = d.payload;
      let dynamicInfo =  getDynamicInfo();
      let bullets = dynamicInfo.allBullets();
      for (var i=0;i<bullets.length;i++) {
        let b = bullets[i];
        let [done, hit] = b.approach(cor[0], cor[1]);
        if (hit) {
          getWorld().incMinionContribute(b.source, b.power);
          state.dynamic.damage += b.power;
          if (state.dynamic.damage > 200) {
            state.dynamic.alien.status = "dizzle";
            let alienSprite:Sprite = getSprite(state.dynamic.alien.sprite);
            alienSprite.currentTrigger = state.dynamic.timeClock;
            state.dynamic.alien.dizzle = 12;
            state.dynamic.damage = 0;
            let instance = getWorld().getInstanceByIndex(state.dynamic.viewIndex);
            let rewardinfo = instance.calculateRewards(100, state.dynamic.alien.drop);
            //state.dynamic.events.unshift(RewardEvent(state.dynamic.alien.name, instance, rewardinfo));
            //state.dynamic.events.unshift(DropEvent(state.dynamic.alien.name, instance, state.dynamic.alien.drop));
          }
        }
        if (!done) {
          cs.push(b);
        }
      }
      dynamicInfo.resetBullets(cs);
    },
    signalAlien: (state) => {
      let status = state.dynamic.alien.status;
      if (status == "run") {
        state.dynamic.alien.pos += 1;
        if (state.dynamic.alien.pos >= individualWidth * getWorld().instances.length) {
          /* TODO update dynamic */
          state.dynamic.alien = state.dynamic.upcomingAlien;
          state.dynamic.upcomingAlien = randomAlien();
        }
      }
      if (status == "dizzle") {
        state.dynamic.alien.dizzle -= 1;
        if (state.dynamic.alien.dizzle == 0) {
          state.dynamic.alien.status = "run";
        }
      }
    },
    switchView: (state, d) => {
      state.dynamic.viewIndex = d.payload;
      let instance = getWorld().getInstanceByIndex(state.dynamic.viewIndex);
      getDynamicInfo().loadInstance(instance.info);
      getWorld().flipWeather();
    },

    setReaction: (state, d) => {
      state.sketch.reaction = d.payload;
    },
    signalPlaceMinion: (state, d) => {
      let viewIndex = d.payload.viewIndex;
      let instance = getWorld().getInstanceByIndex(viewIndex);
      getWorld().placeMinion(d.payload.mId, viewIndex);
      instance.info.minions.push(d.payload.mId);
      getDynamicInfo().loadInstance(instance.info);
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(updateTimeClockAsync.fulfilled, (meta: DynamicGameState, c) => {
        meta.dynamic.timeClock += 1;
        if(meta.sketch.reaction) {
          if (meta.sketch.reaction.current < meta.sketch.reaction.duration) {
            meta.sketch.reaction = {...meta.sketch.reaction, current: meta.sketch.reaction.current+1};
          } else {
            meta.sketch.reaction = null;
          }
        }
      })
      .addCase(loadDynamic.fulfilled, (meta: DynamicGameState, c) => {
        let ds: SimulateState = c.payload;
        meta.dynamic = ds.dynamicState;
      })

  },
});
export const {signalBulletsUpdate, signalAlien, switchView, addEvent, signalSketch, signalDynamic, signalPlaceMinion, setReaction, setCursor} = dynamicSlice.actions;
export const selectTimeClock = (state: RootState) => state.dynamic.dynamic.timeClock;
export const selectEvents = (state: RootState) => state.dynamic.dynamic.events;
export const selectAlien = (state: RootState) => state.dynamic.dynamic.alien;
export const selectUpcomingAlien = (state: RootState) => state.dynamic.dynamic.upcomingAlien;
export const selectViewIndex = (state: RootState) => state.dynamic.dynamic.viewIndex;
export const selectSketchSignal = (state: RootState) => state.dynamic.sketch.sketchSignal;
export const selectDynamicSignal = (state: RootState) => state.dynamic.sketch.sketchDynamic;
export const selectReaction = (state: RootState) => state.dynamic.sketch.reaction;
export const selectCursor = (state: RootState) => state.dynamic.sketch.cursor;
export default dynamicSlice.reducer;
