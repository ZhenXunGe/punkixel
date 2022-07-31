import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { WritableDraft } from 'immer/dist/types/types-external';
import { RootState } from '../app/store';
import { Player } from '../../server/types';
import { getWorld, initializeWorld, RankInfo } from './world';
import { InstanceInfo } from '../data/instance';


export interface StatusState {
    energy: number;
    punkxiel: number;
    contribution: number;
    reward: number;
    pph: number,
    player: Player | null;
    dyeFocus: number;
    synchronize: number;
    rank: RankInfo,
}

const initialState: StatusState = {
    energy: 50,
    punkxiel: 1000,
    contribution: 0,
    rank: {current:0, instances:[]},
    reward: 0,
    pph:0,
    player: null,
    dyeFocus: 0,
    synchronize:0,
};

function timeout(ms:number) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

interface LoadState {
  account: string;
  sync: number;
}


export const loadWorld = createAsyncThunk(
  'world/fetchWorld',
  async (account:string, thunkApi) => {
    let r = await initializeWorld(account);
    console.log("world initialized");
    return {account: account, sync: r};
  }
);

export const loadRank = createAsyncThunk(
  'world/fetchRank',
  async (account:string, thunkApi) => {
    let rank:RankInfo = await getWorld().getTopRank();
    console.log("ran info:", rank);
    return rank;
  }
);


function updateState(state: WritableDraft<StatusState>) {
  let world = getWorld();
  let player = world.getPlayer(state.player!.id);
  state.player = player;
  let instance = getWorld().getInstanceByIndex(player.homeIndex);
  state.pph = instance.info.pph + instance.info.basePPH;
  let total = 0;
  for (var m of player.inventory) {
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
      state.dyeFocus = d.payload;
    },

    updatePPH: (state, d) => {
      let delta = d.payload.delta;
      let player = state.player!;
      getWorld().updateInstancePPH(player.homeIndex, delta);
      //instance.info.pph = instance.info.pph + instance.info.basePPH;
      getWorld().spentPunkxiel(player.id, d.payload.cost);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loadWorld.fulfilled, (state, c) => {
        let sync = c.payload;
        state.player! = getWorld().getPlayer(sync.account);
        updateState(state);
        state.synchronize = sync.sync;
      })
      .addCase(loadRank.fulfilled, (state, c) => {
        let rankInfo:RankInfo = c.payload;
        state.rank = rankInfo;
      });
  },
});

export const { updatePPH, pickColor,
    updateStatus,updateInventory,
} = statusSlice.actions;

export const selectEnergy = (state: RootState) => state.status.energy;
export const selectPunkixel= (state: RootState) => state.status.punkxiel;
export const selectRank = (state: RootState) => state.status.rank;
export const selectPPH = (state: RootState) => state.status.pph;
export const selectReward = (state: RootState) => state.status.reward;
export const selectDye = (state: RootState) => state.status.dyeFocus;
export const selectPlayer = (state: RootState) => state.status.player;
export const selectContribution = (state: RootState) => state.status.contribution;
export const worldLoaded = (state: RootState) => (state.status.synchronize > 0);
export default statusSlice.reducer;
