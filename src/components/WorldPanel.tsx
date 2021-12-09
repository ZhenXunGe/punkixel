import { WorldBoard } from './WorldBoard';
import { Status } from './Status';
import { Thumbnail } from './Thumbnail';
import { ToolBarWeapon } from './toolbar/ToolBarWeapon';
import React, { useState } from 'react';
export function WorldPanel() {
  return (
    <>
    <WorldBoard></WorldBoard>
    <Status></Status>
    <ToolBarWeapon></ToolBarWeapon>
    <Thumbnail></Thumbnail>
    </>
  );
}

