import React, { useState } from 'react';
import { useAppSelector, useAppDispatch } from '../../app/hooks';
import '../Component.css';
import { Button, DropdownButton, Dropdown } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

import {
    action,
    selectPalettes,
    selectPaletteFocus,
} from '../../data/statusSlice';

export function ToolBarDye() {
    const palettes = useAppSelector(selectPalettes);
    const palette_focus = useAppSelector(selectPaletteFocus);
  return (
    <div className="tool-bar">
        <ul>
            <li>
                <ul className="inline-brick">
                    <li>Dye</li>
                    <li>
                    <DropdownButton
                        title = {palette_focus.name}
                    >
                    { palettes.map(p =>
                        <Dropdown.Item href="#/action-1">{p.name}</Dropdown.Item>
                      )
                    }
                    </DropdownButton>
                    </li>
                    { palette_focus.dye.map(d =>
                        <li>{d.color}</li>
                      )
                    }
                    <li>{palette_focus.pph} PPH Per Pixel</li>
                </ul>
            </li>
            <li> shrink </li>
            <li> undo </li>
            <li> reclaim </li>
        </ul>
    </div>
  );
}
