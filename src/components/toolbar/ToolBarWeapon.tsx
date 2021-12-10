import React, { useState } from 'react';
import { useAppSelector, useAppDispatch } from '../../app/hooks';
import '../Component.css';
import { Button, DropdownButton, Dropdown } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

import {
    action,
    selectWeapons,
    selectWeaponFocus,
} from '../../data/statusSlice';



export function ToolBarWeapon() {
  const weapons = useAppSelector(selectWeapons);
  const weapon_focus = useAppSelector(selectWeaponFocus);

  return (
    <div className="tool-bar">
        <ul>
            <li>
                <ul className="inline-brick">
                    <li>Weapon</li>
                    <li>
                    <DropdownButton
                        title = {weapon_focus.name}
                    >
                    { weapons.map(w =>
                        <Dropdown.Item href="#/action-1">{w.name}</Dropdown.Item>
                      )
                    }
                    </DropdownButton>
                    </li>
                    { weapon_focus.weapon.map(w =>
                        <li>weapon icon {w.code}</li>
                      )
                    }
                    <li>{weapon_focus.damage} Damage Per Hit </li>
                </ul>
            </li>
        </ul>
    </div>
  );
}
