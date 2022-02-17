import { WorldBoard } from './WorldBoard';
import { Status } from './Status';
import { AlienItem } from './Alien';
import { Thumbnail } from './Thumbnail';
import { ToolBarWeapon } from './toolbar/ToolBarWeapon';
import Drop from '../sprite/coin/sprite';
export function WorldPanel() {
  return (
    <>
        <div ref={x=>{console.log("load main board")}}></div>
    <WorldBoard></WorldBoard>
    <Status></Status>
    <ToolBarWeapon></ToolBarWeapon>
    <Thumbnail></Thumbnail>
    <AlienItem key="alien"></AlienItem>
    <Drop key="drops"></Drop>
    </>
  );
}

