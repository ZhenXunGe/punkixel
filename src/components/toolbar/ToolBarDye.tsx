import React, { useState } from 'react';
import { useAppSelector, useAppDispatch } from '../../app/hooks';
import '../Component.css';
import { Button, DropdownButton, Dropdown } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

import { individualWidth } from "../../data/draw";

import {
    action,
    selectPalettes,
    selectPaletteFocus,
    selectDye,
    pickColor,
    pickPalette,
    signalSketch,
    selectHomeIndex,
    selectWorld,
} from '../../data/statusSlice';

export function ToolBarDye() {
  const palettes = useAppSelector(selectPalettes);
  const pickedPalette = useAppSelector(selectPaletteFocus);
  const dispatch = useAppDispatch();
  const pickedDye = useAppSelector(selectDye);
  const homeIndex = useAppSelector(selectHomeIndex);
  const world = useAppSelector(selectWorld);
  const onSketch = () => {
    let d = world.getInstance(homeIndex*individualWidth).drawer;
    d.resetSketch();
    dispatch(signalSketch())
  }
  return (
    <div className="tool-bar">
        <ul>
            <li>
                <ul className="inline-brick">
                    <li>Dye</li>
                    <li>
                    <DropdownButton
                        title = {palettes[pickedPalette].name}
                    >
                    { palettes.map((p,idx) =>
                        <Dropdown.Item onClick={() => dispatch(pickPalette(idx))}>{p.name}</Dropdown.Item>
                      )
                    }
                    </DropdownButton>
                    </li>
                    { palettes[pickedPalette].dye.map((d,idx) =>
                        <li>
                        <div className="dye-item" style= {{
                            backgroundColor: `rgb($(d.color[0]), $(d.color[1]), $(d.color[2]))`,
                            border: d.color == palettes[pickedPalette].dye[pickedDye].color ? '1px solid red' : '1px solid gray',
                        }} onClick={() => dispatch(pickColor(idx))}>
                        </div>
                        </li>
                      )
                    }
                    <li>{palettes[pickedPalette].pph} PPH Per Pixel</li>
                </ul>
            </li>
            <li onClick={() => onSketch()}> sketch </li>
            <li> undo </li>
            <li> reclaim </li>
        </ul>
    </div>
  );
}
