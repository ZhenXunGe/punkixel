import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { WritableDraft } from 'immer/dist/types/types-external';
import { RootState } from '../app/store';
import {
    basic_palettes,
    liquid_green_palette,
    liquid_blue_palette,
    ColorCategory,
} from  './palette';
import { Player } from './player';
import { getWorld, initializeWorld } from './world';

export interface StatusState {
    energy: number;
    punkxiel: number;
    contribution: number;
    ranking: number;
    reward: number;
    pph: number,
    player: Player | null;
    dye_focus: number;
    synchronize: number;
}

const initialState: StatusState = {
    energy: 50,
    punkxiel: 1000,
    contribution: 0,
    ranking: 9999,
    reward: 0,
    pph:0,
    player: null,
    dye_focus: 0,
    synchronize:0,
};

function timeout(ms:number) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

export const loadWorld = createAsyncThunk(
  'world/fetchWorld',
  async (thunkApi) => {
    return await initializeWorld(true);
  }
);

function updateState(state: WritableDraft<StatusState>) {
  let player = getWorld().getPlayer("solo");
  state.player = player;
  let instance = getWorld().getInstanceByIndex(player.homeIndex);
  state.pph = instance.info.pph + instance.info.basePPH;
  let total = 0;
  for (var m of state.player.inventory) {
    if (m!==null) {
      let world = getWorld();
      let minion = world.getMinion(m);
      //console.log("inventory", m, minion.contribution, getWorld().timestamp);
      total += minion.contribution;
    }
  };
  state.contribution = total;
}
export const statusSlice = createSlice({
  name: 'status',
  initialState,
  reducers: {
    updateStatus: (state) => { updateState(state);},
    updateInventory: (state, d) => {
      //state.inventory_updater = d.payload.bol;
    },
    pickColor: (state, d) => {
      state.dye_focus = d.payload;
    },

    updatePPH: (state, d) => {
      let delta = d.payload.delta;
      let player = getWorld().getPlayer("solo");
      getWorld().updateInstancePPH(player.homeIndex, delta);
      //instance.info.pph = instance.info.pph + instance.info.basePPH;
      getWorld().spentPunkxiel("solo", d.payload.cost);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loadWorld.fulfilled, (state, c) => {
        updateState(state);
        state.synchronize = c.payload;
      });
  },
});

export const { updatePPH, pickColor,
    updateStatus,updateInventory,
} = statusSlice.actions;

export const selectEnergy = (state: RootState) => state.status.energy;
export const selectPunkixel= (state: RootState) => state.status.punkxiel;
export const selectRanking = (state: RootState) => state.status.ranking;
export const selectPPH = (state: RootState) => state.status.pph;
export const selectReward = (state: RootState) => state.status.reward;
export const selectDye = (state: RootState) => state.status.dye_focus;
export const selectPlayer = (state: RootState) => state.status.player;
export const selectContribution = (state: RootState) => state.status.contribution;
export const worldLoaded = (state: RootState) => (state.status.synchronize > 0);
export default statusSlice.reducer;
