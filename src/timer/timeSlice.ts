import { createAsyncThunk, createSlice} from '@reduxjs/toolkit';
import { RootState } from '../app/store';

interface BulletInfo {
  x: number;
  y: number;
  source: number;
  power:number;
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
