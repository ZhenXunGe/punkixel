// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { useState } from "react";
import { Button, Modal } from "react-bootstrap";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import { individualWidth } from "../data/draw";
import { randomMinion } from "../data/minion";
import { selectViewIndex, selectWorld } from "../data/statusSlice";
export default function Contribute() {
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  let ratio = 4;
  const dispatch = useAppDispatch();
  const viewIndex = useAppSelector(selectViewIndex);
  const world = useAppSelector(selectWorld);
  const handleConfirm = () => {
    let instance = world.getInstance(viewIndex*individualWidth);
    instance.addMinion(randomMinion())
  }
  return (

    <>
      <Button variant="primary" onClick={handleShow}>
        Protect This Instance
      </Button>

      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Are you sure to protect this city?</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Pick your space ship:
          speed: ???
        </Modal.Body>
        <Modal.Footer>
          <Button variant="Close" onClick={handleClose}>
            Cancel
          </Button>
          <Button variant="Confirm" onClick={handleConfirm}>
            Yes! Why not!
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}