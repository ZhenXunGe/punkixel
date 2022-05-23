// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { useState } from "react";
import { Button, Container, ListGroup, Modal } from "react-bootstrap";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import { selectInventory, selectInventoryUpdater, } from "../data/statusSlice";
// import { MinionSelector } from "../components/Inventory";
import { addEvent, selectTimeClock, selectViewIndex, signalPlaceMinion } from "../dynamic/dynamicSlice";
import { ProtectingEvent } from "../dynamic/event";
import getWorld from "../data/world";
import header from "../images/modal/protect/header.png";
import PROTECT from '../images/world/protect_btn.png';
import CANCEL from '../images/modal/protect/CANCEL.png';
import CHOOSE from '../images/modal/protect/CHOOSE.png';
import './style.scss';
import { getMinionFrame} from "../sprite/spriteSlice";
import {updateInventory} from '../data/statusSlice';
import { PageScroller } from "./scroll";

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
      //  href={"#" + minion.id}
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
  const pageNumber = 3;
  const [current, setCurrent] = useState("none");
  const available = s.inventory.filter((m) => m !== null).map((x:string|null)=>{return x!;});
  const setMinion = (mid: string) => {
    setCurrent(mid);
    s.setminion(mid);
  };
  return (
    <div>
    <ul className="minions"
    // defaultActiveKey={"#" + current}
    >
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
  const inventory = useAppSelector(selectInventory);
  const [startPos, setStartPos] = useState<number>(0);
  const timeClock = useAppSelector(selectTimeClock);

  const available = inventory.filter((m) => m !== null);
  const availableSize = available.length;

  const handleConfirm = () => {
    console.log({ mId: minionId!, viewIndex: viewIndex })
    getWorld().spentPunkxiel("solo", 100);
    dispatch(updateInventory({bol:true}));
    dispatch(signalPlaceMinion({ mId: minionId!, viewIndex: viewIndex }));
    dispatch(addEvent(ProtectingEvent("GruPlayer 1", getWorld().getInstance(viewIndex), getWorld().getMinion(minionId!))));
    setShow(false);
    dispatch(updateInventory({bol:false}));
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
                {/* <ul className="minions"> */}
                <MinionSelector  setminion={setMinionId} pos={startPos} inventory={inventory}></MinionSelector>
                {/* </ul> */}
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


