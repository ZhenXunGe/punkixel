import React, { useState } from 'react';
import '../Component.css';
import { Button, Dropdown } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

export function ToolBarWeapon() {
  return (
    <div className="tool-bar">
        <ul>
            <li>
                <ul className="inline-brick">
                    <li>Weapon</li>
                    <li>
                <Dropdown className="inline-brick">
                  <Dropdown.Toggle variant="success" id="dropdown-basic">
                   Basic Set
                  </Dropdown.Toggle>
                  <Dropdown.Menu>
                    <Dropdown.Item href="#/action-1">Drop By Monstar A</Dropdown.Item>
                    <Dropdown.Item href="#/action-2">Drop By Monstar A</Dropdown.Item>
                    <Dropdown.Item href="#/action-3">Drop By Monstar A</Dropdown.Item>
                  </Dropdown.Menu>
                </Dropdown>
                    </li>
                    <li>c1</li>
                    <li>c2</li>
                    <li>c3</li>
                    <li>c4</li>
                    <li>c5</li>
                    <li>c6</li>
                    <li>c7</li>
                    <li>c8</li>
                </ul>
            </li>
            <li> damage per hit: 100 </li>
        </ul>
    </div>
  );
}
