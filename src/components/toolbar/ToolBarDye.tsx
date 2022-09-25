import React, { MutableRefObject, useEffect, useRef, useState } from 'react';
import { useAppSelector, useAppDispatch } from '../../app/hooks';
import '../Component.scss';
import { PaletteSelect } from '../../../src/modals/palette_select';
import 'bootstrap/dist/css/bootstrap.min.css';
import './style.scss';
import {
  selectPlayer,
  selectDye,
  selectMode,
  setPaintMode,
  pickColor,
} from '../../data/statusSlice';
import { ofDyeIndex, getPalette, toDyeIndex } from '../../server/palette';
import Sketch from "../../modals/sketch";
import { DrawerConfig } from '../Tool';

export function ToolBarDye(props: DrawerConfig) {
  const player = useAppSelector(selectPlayer);
  const palettes = player!.palettes;
  const dispatch = useAppDispatch();
  const [pickedCategory, setPickedCategory] = useState(1);
  const [pickedPalette, setPickedPalette] = useState(0);
  const [pickedBottle, setPickedBottle] = useState(0);
  const [pickMode, setPickMode] = useState(false);
  const mode = useAppSelector(selectMode);
  const pickedDye = useAppSelector(selectDye);
  const [show, setShow] = useState(false);
  return (
    <div className="tool-bar">

      <ul className="tool-bar-main">
        <li>
          <ul className="inline-brick dye">
            <div className='select_board'>

              <div className='dropdown'>
                <div className='btn_left'>{palettes[pickedCategory-1].name} / {getPalette(palettes[pickedCategory-1].palettes[pickedPalette]).name}</div>
                <div className='btn_right' id="dropdown-custom-1" onClick={() => {
                  setShow(true);
                }} />
              </div>

              <div className='select_right'>
                <div className='select_right_inline'>
                  {
                    getPalette(palettes[pickedCategory-1].palettes[pickedPalette]).dye.map((d, idx) => {
                      let palette = getPalette(palettes[pickedCategory-1].palettes[pickedPalette]);
                      return (
                        <li key={`${pickedPalette}-${idx}`}
                            className={`${d.color == ofDyeIndex(pickedDye).color && pickedBottle == idx ? 'selected' : ''}`}
                        >
                          <div className='dye-item'
                            style={{
                              backgroundColor: `rgb(${d.color[0]}, ${d.color[1]}, ${d.color[2]})`,
                            }}

                          >
                          </div>
                          <div className="cover"
                            onClick={() => {
                              console.log("pickColor", pickedCategory, palette.idx, idx);
                              dispatch(pickColor(toDyeIndex(pickedCategory, palette.idx, idx)));
                              setPickedBottle(idx)
                            }
                            }></div>
                        </li>
                        // {idx-3 ? <></>:<li><div style={{width:'20px'}}></div> </li>}
                      )
                    }
                    )
                  }
                </div>
              </div>
              <div className='pixel'>
                <li id='PPH'>{getPalette(palettes[pickedCategory-1].palettes[pickedPalette]).pph}</li>
              </div>
            </div>


          </ul>
        </li>

      </ul>
      <ul className="paint-mode">
        <li className={`${mode === "point"? "active" : "none"} point`}
          onClick={()=>dispatch(setPaintMode("point"))}>
        </li>
        <li className={`${mode === "pen"? "active" : "none"} pen`}
          onClick={()=>dispatch(setPaintMode("pen"))}>
        </li>
        <li className={`${mode === "line"? "active" : "none"} line`}
          onClick={()=>dispatch(setPaintMode("line"))}>
        </li>
        <li className={`${mode === "fill"? "active" : "none"} fill`}
          onClick={()=>dispatch(setPaintMode("fill"))}>
        </li>
      </ul>
      <Sketch main="building" road="road" background={1} canvas={props.canvasRef} ></Sketch>
      <PaletteSelect pickedCategory={pickedCategory} pickedPalette={pickedPalette} show={show} setPickedCategory={setPickedCategory} setPickedPalette={setPickedPalette}
        onHide={() => setShow(false)} ></PaletteSelect>
    </div>
  );
}
