import { WorldBoard } from './WorldBoard';
import { Status } from './Status';
import { AlienItem } from './Alien';
import { Thumbnail } from './Thumbnail';
import { ToolBarWeapon } from './toolbar/ToolBarWeapon';
import React, { useState } from 'react';
import { Alert } from 'react-bootstrap';
export function WorldPanel() {
  return (
    <>
    <WorldBoard></WorldBoard>
    <Status></Status>
    <ToolBarWeapon></ToolBarWeapon>
    <Thumbnail></Thumbnail>
    <Alert key='alarm-01' variant='danger' className="alarm">
    ALARM: Alain from XXXX is approaching and will land on Z City within 10 days
    </Alert>
    <AlienItem></AlienItem>
    </>
  );
}

