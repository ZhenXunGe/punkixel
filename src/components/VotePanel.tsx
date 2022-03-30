import { MainBoard } from './MainBoard';
import { RankingList } from './RankingList';
import { Status } from './Status';
import { Thumbnail } from './Thumbnail';
import { WorldBoard } from './WorldBoard';
import { ToolBarWeapon } from './toolbar/ToolBarWeapon';
import React, { useState } from 'react';
export function VotePanel() {
  return (
    <>
    {/* <Status></Status> */}
    <WorldBoard></WorldBoard>
    <Status></Status>
    <ToolBarWeapon></ToolBarWeapon>
    <Thumbnail></Thumbnail>
    <RankingList></RankingList>
    </>
  );
}

