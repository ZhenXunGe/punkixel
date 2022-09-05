import React, { MutableRefObject, useEffect, useRef, useState } from 'react';
import { useAppSelector, useAppDispatch } from '../../app/hooks';
import '../Component.scss';
import { PaletteSelect } from '../../../src/modals/palette_select';
import 'bootstrap/dist/css/bootstrap.min.css';
import './style.scss';
import {
  selectPlayer,
  pickColor,
} from '../../data/statusSlice';
import { PalettePurchase }  from '../../modals/palette';
import { dye_table, toDyeIndex } from '../../server/palette';
import { Palette, Dye } from '../../server/types';

interface ToolBarMarketProp {
}

function projColor(color: number) {
  let r = color.toString(16);
  if(r.length ===1) {
    r = `0${r}`;
  }
  return r;
}

function formatColor(color: Array<number>) {
  return `#${projColor(color[0])}${projColor(color[1])}${projColor(color[2])}`;
}

interface DyeElementProps {
  c: number;
  p: number;
  d: number;
  dye:Dye;
}

function DyeElement(props: DyeElementProps) {
  const dispatch = useAppDispatch();
  return (<div style={{backgroundColor: formatColor(props.dye.color)}}
    onClick={() => {
        dispatch(pickColor(toDyeIndex(props.c, props.p, props.d)));}
    }
  ></div>);
}

interface PaletteInternalProps {
  c: number;
  p: number;
  palette: Palette;
}

function PaletteInternal(props: PaletteInternalProps) {
  return (
    <>
      <div className="column">
         <DyeElement dye={props.palette.dye[0]} c={props.c} p={props.p} d={0}></DyeElement>
         <DyeElement dye={props.palette.dye[1]} c={props.c} p={props.p} d={1}></DyeElement>
         <DyeElement dye={props.palette.dye[2]} c={props.c} p={props.p} d={2}></DyeElement>
         <DyeElement dye={props.palette.dye[3]} c={props.c} p={props.p} d={3}></DyeElement>
      </div>
      <div className="column">
         <DyeElement dye={props.palette.dye[4]} c={props.c} p={props.p} d={4}></DyeElement>
         <DyeElement dye={props.palette.dye[5]} c={props.c} p={props.p} d={5}></DyeElement>
         <DyeElement dye={props.palette.dye[6]} c={props.c} p={props.p} d={6}></DyeElement>
         <DyeElement dye={props.palette.dye[7]} c={props.c} p={props.p} d={7}></DyeElement>
      </div>
    </>
  );
}

interface MarketInternalProps {
  c: number;
}

function MarketInternal(props: MarketInternalProps) {
  return (
    <div className="thumbnail-market" key="thumbnail-market">
           {dye_table[props.c].map((palette, i) =>{
               console.log("palette", palette);
               return (<PaletteInternal palette={palette} c={props.c} p={i} ></PaletteInternal>);
           })}
    </div>
  );

}




export function ToolBarMarket(props: ToolBarMarketProp) {
  const player = useAppSelector(selectPlayer);
  const [category, setCategory] = useState(1);
  return (
    <div className="tool-bar">
      <div className="dye-market">
        <div className="category-radiation-button" onClick={()=>{setCategory(3)}}></div>
        <div className="category-spin-button" onClick={()=>{setCategory(2)}}></div>
        <div className="category-basic-button" onClick={()=>{setCategory(1)}}></div>
      </div>
      <PalettePurchase paletteIndex={0x10}></PalettePurchase>
      <MarketInternal c={category} ></MarketInternal>);
    </div>
  );
}
