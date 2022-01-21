import React, { useState } from 'react';
import { useAppSelector, useAppDispatch } from '../app/hooks';
import {
  action,
  selectEnergy,
} from '../data/statusSlice';
import { PunkxielDrawer } from "./Drawer";
import { World } from "../data/draw";

export function MainBoard () {


  const dispatch = useAppDispatch();
  return (
    <div className="main-board">
        <PunkxielDrawer></PunkxielDrawer>
    </div>
  );
}
