import { createAsyncThunk, createSlice} from '@reduxjs/toolkit';
import { rawListeners } from 'process';
import { RootState } from '../app/store';
import { Alien, randomAlien } from '../data/alien';
import { individualWidth } from '../data/draw';
import { availableMinions, getMinionById, Minion } from '../data/minion';
import getWorld from '../data/world';
import { Sprite } from '../sprite/sprite';
import { getSprite } from '../sprite/spriteSlice';
import { BulletInfo } from './bullet';
import { DropEvent, Event, RewardEvent }  from './event';
import { InstanceInfo } from '../data/instance';


export class DynamicMinion {
  minion: Minion;
  offsetX: number;
  offsetY: number;
  constructor(minion: Minion) {
    this.minion = minion;
    this.offsetX = 0;
    this.offsetY = 0;
  }
}


class DynamicInfo {
  bullets: Array<BulletInfo> = [];
  minions: Array<DynamicMinion> = [];

  addBullet(d:BulletInfo) {
    this.bullets.push(d);
  };

  resetBullets() {
    this.bullets = [];
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

  updateMinionPosition(minion: DynamicMinion) {
    if (minion.minion.type !== "land") {
      let m = minion.minion;
      let pos_x = minion.offsetX + m.x + (1 - Math.floor(Math.random() * 3)) * 5;
      if (pos_x < 0) { pos_x = 0; };
      if (pos_x > 900) { pos_x = 900; };
      minion.offsetX = pos_x - m.x;
    }
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


export interface DynamicState {
    timeClock: number;
    events: Array<Event>;
    alien: Alien;
    upcomingAlien: Alien;
    viewIndex: number;
    sketchSignal: number;
    damage: number;
}

const initialState: DynamicState = {
  timeClock: 0,
  events:[],
  alien: randomAlien(),
  upcomingAlien: randomAlien(),
  viewIndex: 0,
  sketchSignal: 0,
  damage:0,
};

function timeout(ms:number) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

export const updateTimeClockAsync = createAsyncThunk(
    'dynamic/updateTimeClockAsync',
    async (timerId:number, thunkAPI) => {
      await timeout(1000);
      return 1;
    }
)

export const dynamicSlice = createSlice({
  name: 'dynamic',
  initialState,
  reducers: {
    addEvent: (state, d) => {
      state.events.unshift(d.payload);
    },
    signalSketch: (state) => {
      state.sketchSignal ++;
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
          state.damage += b.power;
          if (state.damage > 200) {
            state.alien.status = "dizzle";
            let alienSprite:Sprite = getSprite(state.alien.sprite);
            alienSprite.currentTrigger = state.timeClock;
            state.alien.dizzle = 12;
            state.damage = 0;
            let instance = getWorld().getInstanceByIndex(state.viewIndex);
            let rewardinfo = instance.calculateRewards(100, state.alien.drop);
            state.events.unshift(RewardEvent(state.alien.name, instance, rewardinfo));
            state.events.unshift(DropEvent(state.alien.name, instance, state.alien.drop));
          }
          console.log(`alien has taken ${state.damage} damage`);
        }
        if (!done) {
          cs.push(b);
        }
      }
      bullets = cs;
    },
    signalAlien: (state) => {
      let status = state.alien.status;
      if (status == "run") {
        state.alien.pos += 1;
        if (state.alien.pos >= individualWidth * getWorld().instances.length) {
          state.alien = state.upcomingAlien;
          state.upcomingAlien = randomAlien();
        }
      }
      if (status == "dizzle") {
        //let instance = getWorld().getInstanceById(state.viewIndex);
        //instance.info.drops.push(state.alien.pos % individualWidth);
        state.alien.dizzle -= 1;
        if (state.alien.dizzle == 0) {
          state.alien.status = "run";
        }
      }
    },
    switchView: (state, d) => {
      state.viewIndex = d.payload;
      let instance = getWorld().getInstanceByIndex(state.viewIndex);
      getDynamicInfo().loadInstance(instance.info);
      getWorld().flipWeather();
    },
    signalPlaceMinion: (state, d) => {
      let viewIndex = d.payload.viewIndex;
      let instance = getWorld().getInstanceByIndex(viewIndex);
      getWorld().placeMinion(d.payload.mId, viewIndex);
      instance.info.minions.push(d.payload.mId);
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(updateTimeClockAsync.fulfilled, (meta: DynamicState, c) => {
        meta.timeClock += 1;
      })
  },
});
export const {signalBulletsUpdate, signalAlien, switchView, addEvent, signalSketch, signalPlaceMinion,} = dynamicSlice.actions;
export const selectTimeClock = (state: RootState) => state.dynamic.timeClock;
export const selectEvents = (state: RootState) => state.dynamic.events;
export const selectAlien = (state: RootState) => state.dynamic.alien;
export const selectUpcomingAlien = (state: RootState) => state.dynamic.upcomingAlien;
export const selectViewIndex = (state: RootState) => state.dynamic.viewIndex;
export const selectSketchSignal = (state: RootState) => state.dynamic.sketchSignal;
export default dynamicSlice.reducer;
