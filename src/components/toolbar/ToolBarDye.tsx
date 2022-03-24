import React, { useEffect, useRef, useState } from 'react';
import { useAppSelector, useAppDispatch } from '../../app/hooks';
import '../Component.scss';
import { Button, DropdownButton, Dropdown, ButtonGroup } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import './style.scss';
import { individualWidth } from "../../data/draw";
import {
  selectPalettes,
  selectDye,
  pickColor,
  selectHomeIndex,
} from '../../data/statusSlice';
import { ofDyeIndex, toDyeColor, toDyeIndex } from '../../data/palette';
import Sketch from "../../modals/sketch";

import bottle from '../../images/home/bottle.png';
import bottle_border from '../../images/home/bottle_border.png';

import getWorld from '../../data/world';
import { getSprite } from '../../sprite/spriteSlice';

export function ToolBarDye() {
  const palettes = useAppSelector(selectPalettes);
  const dispatch = useAppDispatch();
  const [pickedCategory, setPickedCategory] = useState(0);
  const [pickedPalette, setPickedPalette] = useState(0);
  const [pickedBottle, setPickedBottle] = useState(0);
  const pickedDye = useAppSelector(selectDye);
  const homeIndex = useAppSelector(selectHomeIndex);
  const canvasRef = useRef<HTMLCanvasElement>();
  useEffect(() => {
    const spriteSketch = getSprite("sketch");
    if (canvasRef.current) {
      for(var i=0;i<getWorld().instances.length;i++){
        let d = getWorld().getInstance(i*individualWidth).drawer;
        d.resetSketch();
        d.sketchWithStyle(canvasRef.current, spriteSketch, "building", "road");
      }
    }
  },[canvasRef]);
  return (
    <div className="tool-bar">

      <div className="hide">
        <canvas height="100" width="300" ref={e => {
          canvasRef.current = e!
        }}>
        </canvas>
      </div>
      <ul>
        <li>
          <ul className="inline-brick dye">
            {/* <li>Dye</li> */}
            {/* <li>
                    <DropdownButton
                        title = {palettes[pickedCategory].name}
                    >
                    { palettes.map((p,idx) =>
                        <Dropdown.Item onClick={() => setPickedCategory(idx)}>{palettes[idx].name}</Dropdown.Item>
                      )
                    }
                    </DropdownButton>
                    </li>

                    <li>
                    <DropdownButton
                        title = {palettes[pickedCategory].palettes[pickedPalette].name}
                    >
                    { palettes[pickedCategory].palettes.map((p,idx) =>
                        <Dropdown.Item onClick={() => setPickedPalette(idx)}>{p.name}</Dropdown.Item>
                      )
                    }
                    </DropdownButton>
                    </li> */}
            <div className='select_board'>
              <Dropdown as={ButtonGroup}>
                <Button className='btn_left'>{palettes[pickedCategory].name} / {palettes[pickedCategory].palettes[pickedPalette].name}</Button>
                <Dropdown.Toggle split className='btn_right' id="dropdown-custom-1" />
                <Dropdown.Menu className="super-colors">

                  {palettes.map((p, idx) =>
                    <Dropdown.Item onClick={() => setPickedCategory(idx)}>{palettes[idx].name}</Dropdown.Item>
                  )
                  }
                  <Dropdown.Divider />

                  {palettes[pickedCategory].palettes.map((p, idx) =>
                    <Dropdown.Item onClick={() => setPickedPalette(idx)}>{p.name}</Dropdown.Item>
                  )
                  }
                </Dropdown.Menu>
              </Dropdown>


              {/*
                        ↑  is basic select 
                        ↓  is select bottle
                    */}

              <div className='select_right'>
                <div className='select_right_inline'>


                  {
                    palettes[pickedCategory].palettes[pickedPalette].dye.map((d, idx) => {
                      let palette = palettes[pickedCategory].palettes[pickedPalette];

                      return (
                        <li id={`${d.color == ofDyeIndex(pickedDye).color && pickedBottle==idx ? 'selected':''}`}>
                          <div className={`dye-item ${3===idx?'mid':''}  ${d.color == ofDyeIndex(pickedDye).color && pickedBottle==idx ? 'selected':''}`}
                            style={{
                              backgroundImage: d.color == ofDyeIndex(pickedDye).color ? `url(${bottle_border})`:``,
                              // marginTop:d.color == ofDyeIndex(pickedDye).color && pickedBottle==idx ? '10px':'0px',
                              // backgroundColor: `rgb(${d.color[0]}, ${d.color[1]}, ${d.color[2]})`,
                              // border: d.color == ofDyeIndex(pickedDye).color ? '1px solid red' : '1px solid gray',
                            }}
                            onClick={() => {
                              dispatch(pickColor(toDyeIndex(palette.idx, + idx)))
                              setPickedBottle(idx)
                            }
                            }
                          >
                            <img src={bottle}></img>
                          </div>

                        </li>
                        
                        // {idx-3 ? <></>:<li><div style={{width:'20px'}}></div> </li>}
                      )
                    }
                    )
                  }
                </div>
              </div>
            </div>
            <div className='pixel'>
              <li id='PPH'>{palettes[pickedCategory].palettes[pickedPalette].pph}</li>
            </div>

          </ul>
        </li>

      </ul>

      <Sketch main="building" road="road" background={1} canvas={canvasRef} ></Sketch>

    </div>
  );
}
