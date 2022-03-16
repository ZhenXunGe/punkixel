// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { useState } from "react";
import { Button, Modal } from "react-bootstrap";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import { selectInventory, } from "../data/statusSlice";
import { MinionSelector } from "../components/Inventory";
import { addEvent, selectViewIndex, signalPlaceMinion } from "../dynamic/dynamicSlice";
import { ProtectingEvent } from "../dynamic/event";
import getWorld from "../data/world";

import PROTECT from '../images/world/protect_btn.png';
import './style.scss';
export default function Contribute() {
  const [show, setShow] = useState(false);
  const [minionId, setMinionId] = useState<string|null>(null);
  const inventory = useAppSelector(selectInventory);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  let ratio = 4;
  const dispatch = useAppDispatch();
  const viewIndex = useAppSelector(selectViewIndex);
  const handleConfirm = () => {
    dispatch(signalPlaceMinion({mId:minionId!, viewIndex:viewIndex}));
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
      <Modal show={show} onHide={handleClose} centered>
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
      </Modal>
    </>
  );
}