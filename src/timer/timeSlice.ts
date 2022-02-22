import { createAsyncThunk, createSlice} from '@reduxjs/toolkit';
import { RootState } from '../app/store';

interface BulletInfo {
  x: number;
  y: number;
  source: number;
  power:number;
  tx: number;
  ty: number;
  track: [[number, number]];
  ti: number;
}

export function bulletAngle(b: BulletInfo): number {
  let i = b.ti;
  let t = b.track;
  let len = t.length;
  var angle = Math.PI / 2;
  if (i < len - 1) {
    let dx = t[i][0] - b.tx;
    let dy = t[i][1] - b.ty;
    if (dx !== 0) {
      let tan = dy / dx;
      angle = Math.atan(tan);
      if (angle < 0) {
        angle = angle + Math.PI;
      }
      angle = ((len - i) * angle + i * Math.PI / 2) / len;
    }
  }
  // console.log("bullet angle:", angle);
  return angle;
}

export interface TimerState {
    timeClock: number;
    contribution: number;
    bullets: Array<BulletInfo>;
}

const initialState: TimerState = {
  contribution:0,
  timeClock: 0,
  bullets: [],
};

function timeout(ms:number) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

export const updateTimeClockAsync = createAsyncThunk(
    'timer/updateTimeClockAsync',
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

export const timerSlice = createSlice({
  name: 'timer',
  initialState,
  reducers: {
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
        let len = b.track.length;
        if (b.ti < len) { 
          let nb = b.track[b.ti];
          b.x = ((len - b.ti) * nb[0] + b.ti * cor[0]) / len;
          b.y = ((len - b.ti) * nb[1] + b.ti * cor[1]) / len;
          cs.push(b);
          b.ti++;
        } else {
          state.contribution += 1;
        }
      }
      state.bullets = cs;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(updateTimeClockAsync.fulfilled, (meta: TimerState, c) => {
        meta.timeClock += 1;
      })
  },
});
export const { resetBullets, signalBulletsUpdate, addBullet } = timerSlice.actions;
export const selectTimeClock = (state: RootState) => state.timer.timeClock;
export const selectBullets = (state: RootState) => state.timer.bullets;
export const selectContribution = (state: RootState) => state.timer.contribution;
export default timerSlice.reducer;
