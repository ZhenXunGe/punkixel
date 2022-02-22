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
  let track = b.track;
  let len = track.length;
  var angle = 0;
  if (i < len - 1) {
    let tan = (track[i][1] - b.track[i+1][1]) / (b.track[i][0] - b.track[i+1][0]);
    angle = Math.atan(tan);
    angle = ((len - i) * angle + i * Math.PI / 2) / len;
  } else {
    angle = Math.PI / 2;
  }
  console.log("bullet angle:", angle);
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
        let d = distance(b, cor);
        if (b.ti < b.track.length) { 
           let nb = b.track[b.ti++];
           b.x = nb[0];
           b.y = nb[1];
           cs.push(b);
        } else {
          if (b.source === 1) {
            state.contribution += 1;
          }
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
