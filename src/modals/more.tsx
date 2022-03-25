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
import bg from '../images/modal/more/background.png';
interface MORE {
  name: string;
  description: string;
  speed:number;
  favourate:string;
  imgsrc:string;
}




export default function More(props:MORE) {
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
      <button className="more" onClick={handleShow}>
        {/* <img src={PROTECT} ></img> */}
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
            <div className="more_area">
              <img src={bg} className="more_background" />
              <div className="more_left">
                <img src={props.imgsrc}  ></img>
                <div className='monsterName'>{props.name}</div>
              </div>
              <div className="more_right">
                <ul className="skill">
                  <li></li>
                  <li></li>
                  <li></li>
                </ul>
                <ul className="proto">
                  <li>{props.speed}</li>
                  <li>{props.favourate}</li>
                </ul>
              <div className="desc">
                <span>
                  {props.description}
                </span></div>
              </div>
            </div>

          </Container>
        </Modal.Body>

      </Modal>
    </>
  );
}