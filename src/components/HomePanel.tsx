import { MainBoard } from './MainBoard';
import { Status } from './Status';
import { Thumbnail } from './Thumbnail';
import { ToolBarDye } from './toolbar/ToolBarDye';
import React, { useState } from 'react';
export function HomePanel() {
  return (
    <>
    <MainBoard></MainBoard>
    <Status></Status>
    <ToolBarDye></ToolBarDye>
    <Thumbnail></Thumbnail>
    </>
  );
}

