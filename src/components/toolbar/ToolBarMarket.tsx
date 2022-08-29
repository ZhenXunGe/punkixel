import React, { MutableRefObject, useEffect, useRef, useState } from 'react';
import { useAppSelector, useAppDispatch } from '../../app/hooks';
import '../Component.scss';
import { PaletteSelect } from '../../../src/modals/palette_select';
import 'bootstrap/dist/css/bootstrap.min.css';
import './style.scss';
import {
  selectPlayer,
} from '../../data/statusSlice';
import { DrawerConfig } from '../Tool';
import { PalettePurchase }  from '../../modals/palette';

interface ToolBarMarketProp {
}

export function ToolBarMarket(props: ToolBarMarketProp) {
  const player = useAppSelector(selectPlayer);
  return (
    <div className="tool-bar">
      <div className="dye-market">
        <div className="category-radiation-button"></div>
        <div className="category-spin-button"></div>
        <div className="category-basic-button"></div>
      </div>
      <PalettePurchase paletteIndex={0x10}></PalettePurchase>
    </div>
  );
}
