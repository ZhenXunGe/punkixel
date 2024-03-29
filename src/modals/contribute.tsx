// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { useState } from "react";
import { Button, Container, ListGroup, Modal } from "react-bootstrap";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import { selectPlayer } from "../data/statusSlice";
import { selectTimeClock, selectViewIndex } from "../dynamic/dynamicSlice";
import { getWorld } from "../data/world";
import header from "../images/modal/protect/header.png";
import PROTECT from '../images/world/protect_btn.png';
import CANCEL from '../images/modal/protect/CANCEL.png';
import CHOOSE from '../images/modal/protect/CHOOSE.png';
import './style.scss';
import { getMinionFrame} from "../sprite/spriteSlice";
import {updateInventory} from '../data/statusSlice';
import { PageScroller } from "./scroll";
import React from "react";

interface SingleSelect {
  current: string;
  setminion: (m: string) => void;
  mId: string;
}

function SingleListItem(m: SingleSelect) {
  let minion = getWorld().getMinion(m.mId)!;
  let ufo = getMinionFrame(minion).src;
  if (minion.location === null) {
    return (
      <li className={`${m.mId === m.current?'selected':'' }`} onClick={() => {m.setminion(m.mId);}}
      > <img src={ufo}></img>
        <span>{minion.id} is now idling. [speed: {minion.power}]</span>
      </li>);
  } else {
    return (<li>
      <img src={ufo}></img>
      <span>{minion.id} is protecting block {minion.location}. [contribution:{minion.contribution} ] </span>
      </li>);
  }
}

interface MinionSelector {
  setminion: (m: string) => void;
  pos: number;
  inventory: Array<string | null>;
}


function MinionSelector(s: MinionSelector) {
  const [current, setCurrent] = useState("none");
  const available = s.inventory.filter((m) => m !== null).map((x:string|null)=>{return x!;});
  const setMinion = (mid: string) => {
    setCurrent(mid);
    s.setminion(mid);
  };
  return (
    <div>
    <ul className="minions">
      {available.map((m, i) => {
        if( i >= s.pos*3 && i <= s.pos*3 + 2 && i <= available.length){
        return <SingleListItem current={current} setminion={setMinion} mId={m} key={m}></SingleListItem>
        }
      })}
    </ul>
    </div>
    )
}


export default function Contribute() {
  const [show, setShow] = useState(false);
  const [minionId, setMinionId] = useState<string | null>(null);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const dispatch = useAppDispatch();
  const viewIndex = useAppSelector(selectViewIndex);
  const player = useAppSelector(selectPlayer)!;
  const [startPos, setStartPos] = useState<number>(0);
  const [status, setStatus] = useState(0); //0 is normal, 1 is waiting, 2 is done
  const available = player.inventory.filter((m) => m !== null);
  const availableSize = available.length;

  const handleConfirm = async () => {
    getWorld().spentPunkxiel(player.id, 100);
    setStatus(1);
    await getWorld().placeMinion(minionId!, viewIndex);
    setStatus(2);
    setShow(false);
    //dispatch(updateInventory({bol:false}));
    //dispatch(signalDynamic);
  }
  return (

    <>
      <button className="protect_btn" onClick={handleShow}>
        <img src={PROTECT} ></img>
      </button>
      <Modal show={show} aria-labelledby="contained-modal-title-vcenter" centered dialogClassName="modal-90w">

        <Modal.Body className="show-grid">
          <Container>
            <button className="closeBtn" onClick={handleClose}></button>
            <div className="select_area">
              <div className="protect_area">
                <div className="headerTitle">
                  <img src={header} ></img>
                </div>
                <MinionSelector  setminion={setMinionId} pos={startPos} inventory={player.inventory}></MinionSelector>
              </div>
            </div>
            <PageScroller show={availableSize > 3 || true} onPageChange={setStartPos} rangeStart={0} rangeEnd={Math.floor(availableSize/3)} pos={startPos}></PageScroller>
            <div className="footer">
              <img onClick={handleClose} className="cancel" src={CANCEL} />
              <img
              //  style={{cursor:minionId!==null?'not-allowed':'pointer',}}
               onClick={handleConfirm} className="choose" src={CHOOSE} />
            </div>
          </Container>
        </Modal.Body>

      </Modal>
    </>
  );
}


