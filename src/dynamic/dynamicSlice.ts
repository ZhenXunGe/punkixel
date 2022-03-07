import { createAsyncThunk, createSlice} from '@reduxjs/toolkit';
import { RootState } from '../app/store';
import { Alien } from '../data/alien';
import { individualWidth } from '../data/draw';
import getWorld from '../data/world';
import { Event }  from './event';

interface BulletInfo {
  x: number;
  y: number;
  source: number;
  power:number;
}

export interface DynamicState {
    timeClock: number;
    contribution: number;
    bullets: Array<BulletInfo>;
    events: Array<Event>;
    alien: Alien;
    viewIndex: number;
}

const initialState: DynamicState = {
  contribution:0,
  timeClock: 0,
  bullets: [],
  events:[],
  alien: {name:"GruStoood", alienId: 0, pos:0, status:"run", dizzle:0},
  viewIndex: 0,
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

const distance = (a:BulletInfo, b:[number, number]) => {
  let dx = a.x - b[0];
  let dy = a.y - b[1];
  return Math.sqrt((dx * dx) + (dy * dy));
} 

export const dynamicSlice = createSlice({
  name: 'dynamic',
  initialState,
  reducers: {
    addEvent: (state, d) => {
      state.events.unshift(d.payload);
    },
    addBullet: (state, d) => {
      state.bullets.push(d.payload);
    },
    resetBullets: (state) => {
      console.log("reset bullets");
      state.bullets = [];
    },
    signalBulletsUpdate: (state, d) => {
      let cs = [];
      let cor:[number, number] = d.payload;
      for (var i=0;i<state.bullets.length;i++) {
        let b = state.bullets[i];
        let d = distance(b, cor);
        if (d > 20) {
          let dnext = d - 20;
          b.x = (dnext/d) * (b.x - cor[0]) + cor[0];
          b.y = (dnext/d) * (b.y - cor[1]) + cor[1];
          cs.push(b);
        } else if (d>10){
          b.x = cor[0];
          b.y = cor[1];
          cs.push(b);
        } else {
          if (b.source === 1) {
            state.contribution += 1;
          }
        }
      }
      state.bullets = cs;
    },
    signalAlien: (state, d) => {
      let status = d.payload;
      let def = "run";
      if (status == "run") {
        state.alien.pos += 1;
        if (state.alien.pos >= individualWidth * getWorld().instances.length) {
          state.alien.pos = 0;
        }
      }
      if (status == "dizzle") {
        if (state.alien.status!="dizzle") {
          let instance = getWorld().getInstanceById(state.viewIndex);
          console.log("drop...", state.viewIndex, instance.info.id);
          instance.info.drops.push(state.alien.pos % individualWidth);
          state.alien.dizzle = 20;
        } else {
          state.alien.dizzle -= 1;
        }
        if (state.alien.dizzle == 0) {
          status = def;
        }
      }
      state.alien.status = status;
    },
    switchView: (state, d) => {
      state.viewIndex = d.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(updateTimeClockAsync.fulfilled, (meta: DynamicState, c) => {
        meta.timeClock += 1;
      })
  },
});
export const { resetBullets, signalBulletsUpdate, addBullet, signalAlien, switchView, addEvent } = dynamicSlice.actions;
export const selectTimeClock = (state: RootState) => state.dynamic.timeClock;
export const selectBullets = (state: RootState) => state.dynamic.bullets;
export const selectContribution = (state: RootState) => state.dynamic.contribution;
export const selectEvents = (state: RootState) => state.dynamic.events;
export const selectAlien = (state: RootState) => state.dynamic.alien;
export const selectViewIndex = (state: RootState) => state.dynamic.viewIndex;
export default dynamicSlice.reducer;
