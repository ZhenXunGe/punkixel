import React, { useState } from 'react';
import { useAppSelector, useAppDispatch } from '../../app/hooks';
import '../Component.css';
import { Button, DropdownButton, Dropdown } from 'react-bootstrap';
import { WeaponItem } from './Weapon';
import { Weapon, Weapons } from "../../data/weapon";
import Contribute from "../../modals/contribute";
import 'bootstrap/dist/css/bootstrap.min.css';

import {
    selectWeapons,
    selectWeaponFocus,
} from '../../data/statusSlice';

export function ToolBarWeapon() {
  const inventory = useAppSelector(selectWeapons);
  const weapons_focus:Weapons = useAppSelector(selectWeaponFocus);

  return (
    <div className="tool-bar">
        <ul>
            <li>
                <ul className="inline-brick">
                    <li>ProtectorList:</li>
                    <Contribute></Contribute>
                    <li>{weapons_focus.damage} Damage Per Hit </li>
                </ul>
            </li>
        </ul>
    </div>
  );
}
