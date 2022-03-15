import React, { useEffect, useRef, useState } from 'react';
import { useAppSelector, useAppDispatch } from '../../app/hooks';
import '../Component.scss';
import { Button, DropdownButton, Dropdown } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

import { individualWidth } from "../../data/draw";
import {
    selectPalettes,
    selectDye,
    pickColor,
    selectHomeIndex,
} from '../../data/statusSlice';
import { ofDyeIndex, toDyeColor, toDyeIndex } from '../../data/palette';
import Sketch from "../../modals/sketch";

export function ToolBarDye() {
  const palettes = useAppSelector(selectPalettes);
  const dispatch = useAppDispatch();
  const [pickedCategory, setPickedCategory] = useState(0);
  const [pickedPalette, setPickedPalette] = useState(0);
  const pickedDye = useAppSelector(selectDye);
  const homeIndex = useAppSelector(selectHomeIndex);
  const canvasRef = useRef<HTMLCanvasElement>();

  /*
  useEffect(() => {
    for(var i=0;i<world.instances.length;i++){
      let d = world.getInstance(homeIndex*individualWidth).drawer;
      d.reset();
      d.sketchWithStyle(canvasRef.current!,spriteSketch);
    }
  },[]);
  */
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
                <ul className="inline-brick">
                    <li>Dye</li>
                    <li>
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
                    </li>
                    { palettes[pickedCategory].palettes[pickedPalette].dye.map((d,idx) => {
                        let palette = palettes[pickedCategory].palettes[pickedPalette];
                        return (
                        <li>
                        <div className="dye-item"
                          style= {{
                            backgroundColor: `rgb(${d.color[0]}, ${d.color[1]}, ${d.color[2]})`,
                            border: d.color == ofDyeIndex(pickedDye).color ? '1px solid red' : '1px solid gray',
                          }}
                          onClick={() => {
                              dispatch(pickColor(toDyeIndex(palette.idx, + idx)))
                            }
                          }
                        >
                        </div>
                        </li>
                        )} 
                      )
                    }
                    <li>{palettes[pickedCategory].palettes[pickedPalette].pph} PPH Per Pixel</li>
                </ul>
            </li>
            <li><Sketch main="building" road="road" background={1} canvas={canvasRef} ></Sketch></li>
        </ul>
    </div>
  );
}
