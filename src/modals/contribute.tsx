// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { useState } from "react";
import { Button, Modal } from "react-bootstrap";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import { individualWidth } from "../data/draw";
import { Minion, randomMinion, getMinionById, availableMinions } from "../data/minion";
import { selectInventory, selectViewIndex, selectWorld, signalPlaceMinion } from "../data/statusSlice";
import { MinionSelector } from "../components/Inventory";


export default function Contribute() {
  const [show, setShow] = useState(false);
  const [minionId, setMinionId] = useState<string|null>(null);
  const inventory = useAppSelector(selectInventory);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  let ratio = 4;
  const dispatch = useAppDispatch();
  const viewIndex = useAppSelector(selectViewIndex);
  const world = useAppSelector(selectWorld);
  const handleConfirm = () => {
    dispatch(signalPlaceMinion(minionId));
    setShow(false);
  }
  return (

    <>
      <Button variant="primary" onClick={handleShow}>
        Protect This Instance
      </Button>

      <Modal show={show} onHide={handleClose} centered>
        <Modal.Header closeButton>
          <Modal.Title>Pick which minion to protect this city?</Modal.Title>
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