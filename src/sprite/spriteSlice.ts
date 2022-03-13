import { createSlice } from '@reduxjs/toolkit';
import { RootState } from '../app/store';
import { Sprite } from './sprite';

interface SpriteMap {
  [id:string]: Sprite;
}

const spriteMap:SpriteMap = {};

export function getSprite(sname:string) {
  return spriteMap[sname];
}
export interface SpriteState {
  total: number;
  loaded: number;
}

export interface SpriteInfo {
  name:string;
  sprite:Sprite;
  resource:number;
}

const initialState: SpriteState = {
  total: 0,
  loaded: 0,
};

export const spriteSlice = createSlice({
  name: 'sprite',
  initialState,
  reducers: {
    installSprite: (state, d) => {
      console.log("total before install", state.total);
      let sinfo :SpriteInfo = d.payload;
      console.log("total beforez", state.total);
      state.total += sinfo.resource;
      console.log("total after", state.total);
      if (spriteMap[sinfo.name]!=undefined) {
        console.error(`sprite ${sinfo.name} already existed`);
      }
      spriteMap[sinfo.name] = sinfo.sprite;
    },
    loadSpriteFrame: (state) => {
      state.loaded += 1;
    } 
  },
  extraReducers: (builder) => {
  },


});

export const { installSprite, loadSpriteFrame } = spriteSlice.actions;
export const spriteIsLoaded = (state: RootState) => {
  return(state.sprite.loaded == state.sprite.total);
}
export const spriteLoaded = (state: RootState) => {
  return(state.sprite.loaded);
}
export const spriteNeedLoaded = (state: RootState) => {
  return(state.sprite.total);
}
export default spriteSlice.reducer;