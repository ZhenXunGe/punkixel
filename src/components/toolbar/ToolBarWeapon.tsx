import React, { useEffect, useState } from 'react';
import { useAppSelector, useAppDispatch } from '../../app/hooks';
import '../Component.css';
import { Button, DropdownButton, Dropdown } from 'react-bootstrap';
import Contribute from "../../modals/contribute";
import 'bootstrap/dist/css/bootstrap.min.css';
import { selectViewIndex, selectWorld } from '../../data/statusSlice';
import { individualWidth } from '../../data/draw';


export function ToolBarWeapon() {
  const viewIndex = useAppSelector(selectViewIndex);
  const world = useAppSelector(selectWorld);
  return (
    <div className="tool-bar">
        <ul>
            <li>
                <ul className="inline-brick">
                    {world.getInstance(viewIndex*individualWidth).info.minions.map((m) => {
                        return <li>{m.id}</li>;
                    })}
                    <li> are protecting this city. </li>
                    <Contribute></Contribute>
                </ul>
            </li>
        </ul>
    </div>
  );
}
