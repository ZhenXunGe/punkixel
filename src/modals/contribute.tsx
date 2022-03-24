// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { useState } from "react";
import { Button, Container, ListGroup, Modal } from "react-bootstrap";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import { selectInventory, } from "../data/statusSlice";
// import { MinionSelector } from "../components/Inventory";
import { addEvent, selectViewIndex, signalPlaceMinion } from "../dynamic/dynamicSlice";
import { ProtectingEvent } from "../dynamic/event";
import getWorld from "../data/world";
import header from "../images/modal/protect/header.png";
import PROTECT from '../images/world/protect_btn.png';
import CANCEL from '../images/modal/protect/CANCEL.png';
import CHOOSE from '../images/modal/protect/CHOOSE.png';
import './style.scss';
import { getSprite } from "../sprite/spriteSlice";

interface MinionSelector {
  setminion: (m: string) => void;
}

interface SingleSelect {
  setminion: (m: string) => void;
  mId: string;
}

export function SingleListItem(m: SingleSelect) {
  let minion = getWorld().getMinion(m.mId)!;
  let sprites = getSprite("ufo");
  let ufo = sprites.getFrame("default", minion.style).src;
  if (minion.location === null) {
    return (
      <li className={``} onClick={() => {m.setminion(m.mId);
      console.log(m.mId);
      }}
      //  href={"#" + minion.id}
      > <img src={ufo}></img>
        <span>{minion.id} is now idling. [speed: {minion.power}]</span>
      </li>);
  } else {
    return (<li > 
      <img src={ufo}></img> 
      <span>is now protecting block {minion.location}. [contribution:{minion.contribution} ] </span>
      </li>);
  }
}
function MinionSelector(s: MinionSelector) {
  const inventory = useAppSelector(selectInventory);
  const [current, setCurrent] = useState("none");
  const setMinion = (mid: string) => {
    setCurrent(mid);
    s.setminion(mid);
  }
  return (
    <ul className="minions"
    // defaultActiveKey={"#" + current}
    >
      {inventory.filter((m) => m !== null).map((m, i) => {
        return <SingleListItem setminion={setMinion} mId={m!} key={m!}></SingleListItem>
      })}
      
    </ul>)
}


export default function Contribute() {
  const [show, setShow] = useState(false);
  const [minionId, setMinionId] = useState<string | null>(null);
  const inventory = useAppSelector(selectInventory);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  let ratio = 4;
  const dispatch = useAppDispatch();
  const viewIndex = useAppSelector(selectViewIndex);
  const handleConfirm = () => {
    dispatch(signalPlaceMinion({ mId: minionId!, viewIndex: viewIndex }));
    dispatch(addEvent(ProtectingEvent("GruPlayer 1", getWorld().getInstance(viewIndex))));
    setShow(false);
  }
  return (

    <>
      {/* <Button variant="primary" onClick={handleShow} className="right">
        Protect This Block
      </Button> */}
      <button className="protect_btn" onClick={handleShow}>
        <img src={PROTECT} ></img>
      </button>
      {/* <Modal show={show} onHide={handleClose} centered>
        <Modal.Header closeButton>
          <Modal.Title>Pick a minion to protect this block?</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <MinionSelector setminion={setMinionId}></MinionSelector>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="Close" onClick={handleClose}>
            Cancel
          </Button>
          <Button active={minionId!==null} variant="Confirm" onClick={handleConfirm}>
            Choose
          </Button>
        </Modal.Footer>
      </Modal> */}
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
                <MinionSelector setminion={setMinionId}></MinionSelector>
                
                {/* </ul> */}
              </div>
            </div>
            <div className="footer">
              <img className="cancel" src={CANCEL} />
              <img className="choose" src={CHOOSE} />
            </div>
          </Container>
        </Modal.Body>

      </Modal>
    </>
  );
}