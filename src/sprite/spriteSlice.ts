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
  totalFrame: 0;
  loadedFrame: number;
}

export interface SpriteInfo {
  name:string;
  sprite:Sprite;
  resource:number;
}

const initialState: SpriteState = {
  total: 0,
  totalFrame: 0,
  loadedFrame: 0,
};

export const spriteSlice = createSlice({
  name: 'sprite',
  initialState,
  reducers: {
    installSprite: (state, d) => {
      console.log("total before install", state.total);
      let sinfo :SpriteInfo = d.payload;
      state.totalFrame += sinfo.resource;
      console.log("total after", state.total);
      if (spriteMap[sinfo.name]!=undefined) {
        console.error(`sprite ${sinfo.name} already existed`);
      }
      state.total += 1;
      spriteMap[sinfo.name] = sinfo.sprite;
    },
    loadSpriteFrame: (state) => {
      state.loadedFrame += 1;
    } 
  },
  extraReducers: (builder) => {
  },


});

export const { installSprite, loadSpriteFrame } = spriteSlice.actions;
export const spriteIsLoaded = (state: RootState) => {
  return(state.sprite.loadedFrame == state.sprite.totalFrame);
}
export const spriteLoaded = (state: RootState) => {
  return(state.sprite.loadedFrame);
}
export const spriteNeedLoaded = (state: RootState) => {
  return(state.sprite.totalFrame);
}
export const spriteNumber = (state: RootState) => {
  return(state.sprite.total);
}

export default spriteSlice.reducer;