
import { Sprite } from '../sprite';
import ufo00 from "./ufo00.png";
import ufo01 from "./ufo01.png";
import ufo10 from "./ufo10.png";
import ufo11 from "./ufo11.png";
import ufo20 from "./ufo20.png";
import ufo21 from "./ufo21.png";
import ufo30 from "./ufo30.png";
import ufo31 from "./ufo31.png";

import MissleFreeze from "./missle-freeze.png";
import MissleExplode from "./missle-explode.png";
import BombFreeze from "./bomb-freeze.png";
import BombExplode from "./bomb-explode.png";
import Bomb from "./bomb.png";
import Missle from "./missle.png";
import Bullet from "./bullet.png";
import Explode from "./explode.png";
import Freeze from "./freeze.png";

import Land01 from "./land01.png";
import Land02 from "./land02.png";
import Land03 from "./land03.png";
import Land04 from "./land04.png";
import Land05 from "./land05.png";
import Land06 from "./land06.png";

import Balloon00 from "./airballoon00.png";
import Balloon01 from "./airballoon01.png";
import Balloon10 from "./airballoon10.png";
import Balloon11 from "./airballoon11.png";
import Balloon20 from "./airballoon00.png";
import Balloon21 from "./airballoon01.png";
import Balloon30 from "./airballoon10.png";
import Balloon31 from "./airballoon11.png";



export const clips = [
  {name:"ufo0", src: [ufo00, ufo01]},
  {name:"ufo1", src: [ufo10, ufo11]},
  {name:"ufo2", src: [ufo20, ufo21]},
  {name:"ufo3", src: [ufo30, ufo31]},
  {name:"airballoon0", src: [Balloon00, Balloon01]},
  {name:"airballoon1", src: [Balloon10, Balloon11]},
  {name:"airballoon2", src: [Balloon20, Balloon21]},
  {name:"airballoon3", src: [Balloon30, Balloon31]},
  {name:"land0", src: [Land01, Land02, Land03, Land04, Land05, Land06]},
  {name:"land1", src: [Land01, Land02, Land03, Land04, Land05, Land06]},
  {name:"land2", src: [Land01, Land02, Land03, Land04, Land05, Land06]},
  {name:"land3", src: [Land01, Land02, Land03, Land04, Land05, Land06]},
  {name:"missle-freeze", src:[MissleFreeze]},
  {name:"missle-explode", src:[MissleExplode]},
  {name:"bomb-freeze", src:[BombFreeze]},
  {name:"bomb-explode", src:[BombExplode]},
  {name:"missle", src:[Missle]},
  {name:"freeze", src:[Freeze]},
  {name:"bomb", src:[Bomb]},
  {name:"bullet", src:[Bullet]},
  {name:"explode", src:[Explode]},
]