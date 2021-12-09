import { MainBoard } from './MainBoard';
import { Market } from './Market';
import { Status } from './Status';
import { Thumbnail } from './Thumbnail';
import React, { useState } from 'react';
export function MarketPanel() {
  return (
    <>
    <Status></Status>
    <Market></Market>
    </>
  );
}

