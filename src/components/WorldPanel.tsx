import { WorldBoard } from './WorldBoard';
import { Status } from './Status';
import { AlienItem } from './Alien';
import { Thumbnail } from './Thumbnail';
import { ToolBarWeapon } from './toolbar/ToolBarWeapon';
import { Alert } from 'react-bootstrap';
import Drop from '../sprite/coin/sprite';
export function WorldPanel() {
  return (
    <>
        <div ref={x=>{console.log("load main board")}}></div>
    <WorldBoard></WorldBoard>
    <Status></Status>
    <ToolBarWeapon></ToolBarWeapon>
    <Thumbnail></Thumbnail>
    <Alert key='alarm-01' variant='danger' className="alarm">
    ALARM: Alain from XXXX is approaching and will land on Z City within 10 days
    </Alert>
    <AlienItem key="alien"></AlienItem>
    <Drop key="drops"></Drop>
    </>
  );
}

