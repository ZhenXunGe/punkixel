import { MainBoard } from './MainBoard';
import { RankingList } from './RankingList';
import { Status } from './Status';
import { Thumbnail } from './Thumbnail';
import React, { useState } from 'react';
export function VotePanel() {
  return (
    <>
    <Status></Status>
    <RankingList></RankingList>
    </>
  );
}

