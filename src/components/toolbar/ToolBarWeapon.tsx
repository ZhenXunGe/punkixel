import React, { useState } from 'react';
import { useAppSelector, useAppDispatch } from '../../app/hooks';
import '../Component.css';
import { Button, DropdownButton, Dropdown } from 'react-bootstrap';
import { WeaponItem } from './Weapon';
import { Weapon, Weapons } from "../../data/weapon";
import 'bootstrap/dist/css/bootstrap.min.css';

import {
    action,
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
                    <li>Weapon</li>
                    <li>
                    <DropdownButton
                        title = {weapons_focus.name}
                    >
                    { inventory.map((w:Weapons) =>
                        <Dropdown.Item href="#/action-1">{w.name}</Dropdown.Item>
                      )
                    }
                    </DropdownButton>
                    </li>
                    { weapons_focus.weapon.map((w:Weapon) =>
                        <li><WeaponItem weapon={w}></WeaponItem></li>
                      )
                    }
                    <li>{weapons_focus.damage} Damage Per Hit </li>
                </ul>
            </li>
        </ul>
    </div>
  );
}
